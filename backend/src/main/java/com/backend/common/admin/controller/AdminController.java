package com.backend.common.admin.controller;

import com.backend.core.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/dashboard")
	public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
		return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "admin ok")));
	}
}


