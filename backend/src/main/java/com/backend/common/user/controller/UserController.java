package com.backend.common.user.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<ApiResponse<Map<String, Object>>> me(Authentication auth) {
		return ResponseEntity.ok(ApiResponse.ok(Map.of("username", auth.getName())));
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<User>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(userService.listUsers()));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<User>> create(@RequestParam @NotBlank String username,
	                                                @RequestParam @NotBlank String password,
	                                                @RequestParam(defaultValue = "USER") Role role) {
		return ResponseEntity.ok(ApiResponse.ok(userService.createUser(username, password, role)));
	}
}


