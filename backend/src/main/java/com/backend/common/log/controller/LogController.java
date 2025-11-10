package com.backend.common.log.controller;

import com.backend.core.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v1/logs")
public class LogController {
	private final List<Map<String, Object>> logs = new CopyOnWriteArrayList<>();

	@GetMapping
	public ResponseEntity<ApiResponse<List<Map<String, Object>>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(new ArrayList<>(logs)));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<Void>> append(@RequestBody Map<String, Object> payload) {
		logs.add(Map.of("timestamp", Instant.now().toString(), "payload", payload));
		return ResponseEntity.ok(ApiResponse.ok());
	}
}


