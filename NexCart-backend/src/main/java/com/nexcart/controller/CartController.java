package com.nexcart.controller;

import com.nexcart.dto.AddToCartRequest;
import com.nexcart.dto.CartResponse;
import com.nexcart.dto.UpdateCartRequest;
import com.nexcart.service.CartService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Customer - Cart", description = "Customer shopping cart APIs")
@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;

	@PostMapping
	public ResponseEntity<String> addToCart(@Valid @RequestBody AddToCartRequest request,
			Authentication authentication) {

		return ResponseEntity.ok(cartService.addToCart(request, authentication));
	}

	@GetMapping
	public ResponseEntity<CartResponse> getCart(Authentication authentication) {

		return ResponseEntity.ok(cartService.getCart(authentication));
	}

	@PutMapping("/{productId}")
	public ResponseEntity<String> updateCartItem(@PathVariable Long productId,
			@Valid @RequestBody UpdateCartRequest request, Authentication authentication) {

		return ResponseEntity.ok(cartService.updateCartItem(productId, request, authentication));
	}

	@DeleteMapping("/{productId}")
	public ResponseEntity<Void> removeCartItem(@PathVariable Long productId, Authentication authentication) {

		cartService.removeCartItem(productId, authentication);

		return ResponseEntity.noContent().build();
	}
}