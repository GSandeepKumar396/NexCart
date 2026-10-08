package com.nexcart.service;

import com.nexcart.dto.OrderItemResponse;
import com.nexcart.dto.OrderResponse;
import com.nexcart.dto.UpdateOrderStatusRequest;
import com.nexcart.entity.*;
import com.nexcart.exception.ResourceNotFoundException;
import com.nexcart.repository.CartRepository;
import com.nexcart.repository.OrderRepository;
import com.nexcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final CartRepository cartRepository;
	private final UserRepository userRepository;

	@Transactional
	public String placeOrder(Authentication authentication) {

		// 1. Get logged-in customer
		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		// 2. Find customer's cart
		Cart cart = cartRepository.findByUserId(customer.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

		// 3. Check whether cart is empty
		if (cart.getItems().isEmpty()) {
			throw new IllegalStateException("Cart is empty");
		}

		// 4. Create order
		Order order = Order.builder().user(customer).status(OrderStatus.PLACED).createdAt(LocalDateTime.now())
				.totalAmount(BigDecimal.ZERO).build();

		BigDecimal totalAmount = BigDecimal.ZERO;

		// 5. Convert cart items into order items
		for (CartItem cartItem : cart.getItems()) {

			Product product = cartItem.getProduct();

			// 6. Check product availability
			if (!product.isAvailable()) {
				throw new RuntimeException(product.getName() + " is unavailable");
			}

			// 7. Check stock
			if (cartItem.getQuantity() > product.getQuantity()) {
				throw new RuntimeException("Insufficient stock for " + product.getName());
			}

			// 8. Calculate item SubTotal
			BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

			totalAmount = totalAmount.add(subtotal);

			// 9. Create order item
			OrderItem orderItem = OrderItem.builder().order(order).product(product).quantity(cartItem.getQuantity())
					.price(product.getPrice()).build();

			order.getItems().add(orderItem);

			// 10. Reduce product stock
			product.setQuantity(product.getQuantity() - cartItem.getQuantity());

			// 11. Update availability
			if (product.getQuantity() == 0) {
				product.setAvailable(false);
			}
		}

		// 12. Set final order total
		order.setTotalAmount(totalAmount);

		// 13. Save order
		orderRepository.save(order);

		// 14. Clear cart
		cart.getItems().clear();

		cartRepository.save(cart);

		return "Order placed successfully. Order ID: " + order.getId();
	}

	public List<OrderResponse> getMyOrders(Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(customer.getId());

		return orders.stream().map(order -> OrderResponse.builder().orderId(order.getId())
				.totalAmount(order.getTotalAmount()).status(order.getStatus()).createdAt(order.getCreatedAt())
				.items(order.getItems().stream()
						.map(item -> OrderItemResponse.builder().productId(item.getProduct().getId())
								.productName(item.getProduct().getName()).quantity(item.getQuantity())
								.price(item.getPrice())
								.subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).build())
						.toList())
				.build()).toList();
	}

	@Transactional(readOnly = true)
	public OrderResponse getOrderById(Long orderId, Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Order order = orderRepository.findOrderWithItems(orderId, customer.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		return OrderResponse.builder().orderId(order.getId()).totalAmount(order.getTotalAmount())
				.status(order.getStatus()).createdAt(order.getCreatedAt())
				.items(order.getItems().stream()
						.map(item -> OrderItemResponse.builder().productId(item.getProduct().getId())
								.productName(item.getProduct().getName()).quantity(item.getQuantity())
								.price(item.getPrice())
								.subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).build())
						.toList())
				.build();
	}

	public List<OrderResponse> getSellerOrders(Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		List<Order> orders = orderRepository.findOrdersBySellerId(seller.getId());

		return orders.stream().map(order -> OrderResponse.builder().orderId(order.getId())
				.totalAmount(order.getTotalAmount()).status(order.getStatus()).createdAt(order.getCreatedAt())
				.items(order.getItems().stream()
						.filter(item -> item.getProduct().getSeller().getId().equals(seller.getId()))
						.map(item -> OrderItemResponse.builder().productId(item.getProduct().getId())
								.productName(item.getProduct().getName()).quantity(item.getQuantity())
								.price(item.getPrice())
								.subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).build())
						.toList())
				.build()).toList();
	}

	@Transactional(readOnly = true)
	public OrderResponse getSellerOrderById(Long orderId, Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Order order = orderRepository.findOrderForSeller(orderId, seller.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Order not found for this seller"));

		return OrderResponse.builder().orderId(order.getId()).totalAmount(order.getTotalAmount())
				.status(order.getStatus()).createdAt(order.getCreatedAt())
				.items(order.getItems().stream()
						.filter(item -> item.getProduct().getSeller().getId().equals(seller.getId()))
						.map(item -> OrderItemResponse.builder().productId(item.getProduct().getId())
								.productName(item.getProduct().getName()).quantity(item.getQuantity())
								.price(item.getPrice())
								.subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).build())
						.toList())
				.build();
	}

	@Transactional
	public String updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Order order = orderRepository.findOrderForSeller(orderId, seller.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Order not found for this seller"));

		OrderStatus currentStatus = order.getStatus();
		OrderStatus newStatus = request.getStatus();

		// No change
		if (currentStatus == newStatus) {
			throw new IllegalStateException("Order is already " + currentStatus);
		}

		// Final states cannot be changed
		if (currentStatus == OrderStatus.DELIVERED || currentStatus == OrderStatus.CANCELLED) {

			throw new IllegalStateException("Order status cannot be changed from " + currentStatus);
		}

		// Validate status transition
		boolean validTransition = switch (currentStatus) {

		case PLACED -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;

		case CONFIRMED -> newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.CANCELLED;

		case SHIPPED -> newStatus == OrderStatus.DELIVERED;

		case DELIVERED, CANCELLED -> false;
		};

		if (!validTransition) {
			throw new IllegalStateException("Invalid status transition: " + currentStatus + " → " + newStatus);
		}

		order.setStatus(newStatus);

		orderRepository.save(order);

		return "Order status updated to " + newStatus;
	}

	public List<OrderResponse> getAllOrders() {

		List<Order> orders = orderRepository.findAllOrdersWithItems();

		if (orders.isEmpty()) {
			throw new ResourceNotFoundException("No orders found");
		}

		return orders.stream().map(order -> OrderResponse.builder().orderId(order.getId())
				.totalAmount(order.getTotalAmount()).status(order.getStatus()).createdAt(order.getCreatedAt())
				.items(order.getItems().stream()
						.map(item -> OrderItemResponse.builder().productId(item.getProduct().getId())
								.productName(item.getProduct().getName()).quantity(item.getQuantity())
								.price(item.getPrice())
								.subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).build())
						.toList())
				.build()).toList();
	}

	@Transactional
	public String updateAdminOrderStatus(Long orderId, UpdateOrderStatusRequest request) {

		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		OrderStatus currentStatus = order.getStatus();
		OrderStatus newStatus = request.getStatus();

		if (currentStatus == OrderStatus.DELIVERED || currentStatus == OrderStatus.CANCELLED) {

			throw new IllegalStateException("Order status cannot be changed from " + currentStatus);
		}

		order.setStatus(newStatus);

		orderRepository.save(order);

		return "Order status updated to " + newStatus;
	}

}