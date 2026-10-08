package com.nexcart.service;

import com.nexcart.dto.AddToCartRequest;
import com.nexcart.dto.CartResponse;
import com.nexcart.dto.UpdateCartRequest;
import com.nexcart.entity.Cart;
import com.nexcart.entity.CartItem;
import com.nexcart.entity.Product;
import com.nexcart.entity.User;
import com.nexcart.exception.ResourceNotFoundException;
import com.nexcart.repository.CartItemRepository;
import com.nexcart.repository.CartRepository;
import com.nexcart.repository.ProductRepository;
import com.nexcart.repository.UserRepository;
import com.nexcart.dto.CartItemResponse;

import java.math.BigDecimal;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;

	// Add Product APIs
	public String addToCart(AddToCartRequest request, Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Product product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (!product.isAvailable()) {
			throw new RuntimeException("Product is currently unavailable");
		}

		if (request.getQuantity() > product.getQuantity()) {
			throw new RuntimeException("Requested quantity exceeds available stock");
		}

		Cart cart = cartRepository.findByUserId(customer.getId()).orElseGet(() -> {

			Cart newCart = Cart.builder().user(customer).build();

			return cartRepository.save(newCart);
		});

		CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);

		if (cartItem != null) {

			int newQuantity = cartItem.getQuantity() + request.getQuantity();

			if (newQuantity > product.getQuantity()) {
				throw new RuntimeException("Requested quantity exceeds available stock");
			}

			cartItem.setQuantity(newQuantity);

		} else {

			cartItem = CartItem.builder().cart(cart).product(product).quantity(request.getQuantity()).build();
		}

		cartItemRepository.save(cartItem);

		return "Product added to cart successfully";
	}

	// Get Product APIs

	public CartResponse getCart(Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUserId(customer.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));

		List<CartItemResponse> items = cart.getItems().stream().map(item -> {

			Product product = item.getProduct();

			BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

			return CartItemResponse.builder().productId(product.getId()).productName(product.getName())
					.price(product.getPrice()).quantity(item.getQuantity()).subtotal(subtotal).build();
		}).toList();

		BigDecimal totalAmount = items.stream().map(CartItemResponse::getSubtotal).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		return CartResponse.builder().cartId(cart.getId()).items(items).totalAmount(totalAmount).build();
	}

	// Update CartItem APIs

	public String updateCartItem(Long productId, UpdateCartRequest request, Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUserId(customer.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

		CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product is not in the cart"));

		Product product = cartItem.getProduct();

		if (request.getQuantity() > product.getQuantity()) {
			throw new RuntimeException("Requested quantity exceeds available stock");
		}

		cartItem.setQuantity(request.getQuantity());

		cartItemRepository.save(cartItem);

		return "Cart quantity updated successfully";
	}

	// Remove Product From Cart APIs

	public String removeCartItem(Long productId, Authentication authentication) {

		String email = authentication.getName();

		User customer = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUserId(customer.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

		CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product is not in the cart"));

		cartItemRepository.delete(cartItem);

		return "Product removed from cart successfully";
	}
}