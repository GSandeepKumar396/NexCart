package com.nexcart.controller;

import com.nexcart.dto.ProductRequest;
import com.nexcart.dto.ProductResponse;
import com.nexcart.service.ProductService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Seller - Products", description = "Seller product management APIs")
@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

	private final ProductService productService; 

	@PostMapping
	public ResponseEntity<String> createProduct(@Valid @RequestBody ProductRequest request,
			Authentication authentication) {

		return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request, authentication));
	}

	@GetMapping
	public ResponseEntity<Page<ProductResponse>> getSellerProducts(Authentication authentication,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

		return ResponseEntity.ok(productService.getSellerProducts(authentication, page, size));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductResponse> getSellerProduct(@PathVariable Long id, Authentication authentication) {

		return ResponseEntity.ok(productService.getSellerProduct(id, authentication));
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request,
			Authentication authentication) {

		return ResponseEntity.ok(productService.updateProduct(id, request, authentication));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProduct(@PathVariable Long id, Authentication authentication) {

		productService.deleteProduct(id, authentication);

		return ResponseEntity.noContent().build();
	}
}