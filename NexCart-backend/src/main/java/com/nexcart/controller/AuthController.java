package com.nexcart.controller;

import com.nexcart.dto.LoginRequest;
import com.nexcart.dto.RegisterRequest;
import com.nexcart.service.AuthService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor; 

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "Registration and login APIs")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<String> register(
	        @Valid @RequestBody RegisterRequest request) {

		return ResponseEntity
		        .created(URI.create("/api/auth/register"))
		        .body(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {

		return ResponseEntity.ok(authService.login(request));
	}
	
	@PutMapping("/reset-password")
	public ResponseEntity<String> resetPassword(
	        @RequestParam String email,
	        @RequestParam String newPassword) {

	    authService.resetPassword(email, newPassword);

	    return ResponseEntity.ok("Password updated successfully");
	}
}