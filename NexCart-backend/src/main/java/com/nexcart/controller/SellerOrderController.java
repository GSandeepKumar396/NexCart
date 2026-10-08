package com.nexcart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.nexcart.dto.OrderResponse;
import com.nexcart.dto.UpdateOrderStatusRequest;
import com.nexcart.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Seller - Orders", description = "Seller order management APIs")
@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

	private final OrderService orderService;

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getSellerOrders(Authentication authentication) {

		return ResponseEntity.ok(orderService.getSellerOrders(authentication));
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getSellerOrder(@PathVariable Long orderId, Authentication authentication) {

		return ResponseEntity.ok(orderService.getSellerOrderById(orderId, authentication));
	}

	@PutMapping("/{orderId}/status")
	public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId,
			@Valid @RequestBody UpdateOrderStatusRequest request, Authentication authentication) {

		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request, authentication));
	}
}