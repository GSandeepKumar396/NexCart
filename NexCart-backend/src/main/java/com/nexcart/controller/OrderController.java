package com.nexcart.controller;

import com.nexcart.dto.OrderResponse;
import com.nexcart.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Customer - Orders", description = "Customer order APIs")
@RestController
@RequestMapping("/api/customer/orders")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;

	@PostMapping
	public ResponseEntity<String> placeOrder(Authentication authentication) {

		return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(authentication));
	} 

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {

		return ResponseEntity.ok(orderService.getMyOrders(authentication));
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, Authentication authentication) {

		return ResponseEntity.ok(orderService.getOrderById(orderId, authentication));
	}
}