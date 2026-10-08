package com.nexcart.controller;

import com.nexcart.dto.UpdateUserRoleRequest;
import com.nexcart.dto.UserResponse;
import com.nexcart.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
 
@Tag(name = "Admin - Users", description = "Admin user management APIs")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

	private final UserService userService;

	@GetMapping
	public ResponseEntity<List<UserResponse>> getAllUsers() {

		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/{userId}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {

		return ResponseEntity.ok(userService.getUserById(userId));
	}

	@PutMapping("/{userId}/role")
	public ResponseEntity<String> updateUserRole(@PathVariable Long userId,
			@Valid @RequestBody UpdateUserRoleRequest request) {

		return ResponseEntity.ok(userService.updateUserRole(userId, request));
	}

	@DeleteMapping("/{userId}")
	public ResponseEntity<String> deleteUser(@PathVariable Long userId) {

		return ResponseEntity.ok(userService.deleteUser(userId));
	}
}
