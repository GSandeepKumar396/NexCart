package com.nexcart.dto;

import com.nexcart.entity.Role;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponse {

	private Long id;

	private String name;

	private String email;

	private Role role;
}