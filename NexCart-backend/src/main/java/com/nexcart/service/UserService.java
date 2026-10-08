package com.nexcart.service;

import com.nexcart.dto.UpdateUserRoleRequest;
import com.nexcart.dto.UserResponse;
import com.nexcart.entity.User;
import com.nexcart.exception.ResourceNotFoundException;
import com.nexcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public List<UserResponse> getAllUsers() {

		return userRepository.findAllByOrderByCreatedAtDesc().stream().map(this::mapToResponse).toList();
	}

	public UserResponse getUserById(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	public String updateUserRole(Long userId, UpdateUserRoleRequest request) {

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setRole(request.getRole());

		userRepository.save(user);

		return "User role updated to " + request.getRole();
	}

	public String deleteUser(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		userRepository.delete(user);

		return "User deleted successfully";
	}

	private UserResponse mapToResponse(User user) {

		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole())
				.createdAt(user.getCreatedAt()).build();
	}
}
