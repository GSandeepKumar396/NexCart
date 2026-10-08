package com.nexcart.service;

import com.nexcart.dto.LoginRequest;
import com.nexcart.dto.RegisterRequest;
import com.nexcart.entity.Role;
import com.nexcart.entity.User;
import com.nexcart.exception.InvalidCredentialsException;
import com.nexcart.repository.UserRepository;
import com.nexcart.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public String register(RegisterRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		User user = User.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).role(Role.CUSTOMER)
				.createdAt(LocalDateTime.now()).build();

		userRepository.save(user);

		return "User registered successfully";
	}

	public String login(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}

		return jwtService.generateToken(user.getEmail());
	}

	public void resetPassword(String email, String newPassword) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		user.setPassword(passwordEncoder.encode(newPassword));

		userRepository.save(user);
	}
}