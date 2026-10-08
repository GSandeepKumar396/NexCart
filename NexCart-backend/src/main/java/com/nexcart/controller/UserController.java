package com.nexcart.controller;

import com.nexcart.dto.UserProfileResponse;
import com.nexcart.entity.User;
import com.nexcart.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserRepository userRepository;

	@GetMapping("/me")
	public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new RuntimeException("User not found"));

		UserProfileResponse response = UserProfileResponse.builder().id(user.getId()).name(user.getName())
				.email(user.getEmail()).role(user.getRole()).build();

		return ResponseEntity.ok(response);
	}
}