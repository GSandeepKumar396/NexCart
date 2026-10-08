package com.nexcart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexcart.dto.OrderResponse;
import com.nexcart.dto.UpdateOrderStatusRequest;
import com.nexcart.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Admin - Orders", description = "Admin order management APIs")
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

	private final OrderService orderService;

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getAllOrders() {

		return ResponseEntity.ok(orderService.getAllOrders());
	}

	@PutMapping("/{orderId}/status")
	public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId,
			@Valid @RequestBody UpdateOrderStatusRequest request) {

		return ResponseEntity.ok(orderService.updateAdminOrderStatus(orderId, request));
	}
}
