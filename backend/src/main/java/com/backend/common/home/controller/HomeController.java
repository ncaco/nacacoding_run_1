package com.backend.common.home.controller;

import com.backend.core.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {

	@GetMapping
	public ResponseEntity<ApiResponse<Map<String, Object>>> home() {
		return ResponseEntity.ok(ApiResponse.ok(Map.of(
			"message", "Backend API Server",
			"version", "1.0.0",
			"apiVersion", "v1",
			"endpoints", Map.of(
				"auth", "/api/v1/auth/login",
				"users", "/api/v1/users",
				"admin", "/api/v1/admin/dashboard",
				"files", "/api/v1/files",
				"logs", "/api/v1/logs"
			)
		)));
	}
}

