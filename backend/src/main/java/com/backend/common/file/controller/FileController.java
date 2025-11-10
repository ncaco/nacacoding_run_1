package com.backend.common.file.controller;

import com.backend.core.dto.ApiResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {
	private final Path storageDir = Path.of(System.getProperty("java.io.tmpdir"), "uploads");

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Map<String, Object>>> upload(@RequestPart("file") MultipartFile file) throws IOException {
		Files.createDirectories(storageDir);
		String stored = UUID.randomUUID() + "_" + file.getOriginalFilename();
		Path target = storageDir.resolve(stored);
		Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
		return ResponseEntity.ok(ApiResponse.ok(Map.of("filename", stored, "size", file.getSize())));
	}

	@GetMapping("/{name}")
	public ResponseEntity<Resource> download(@PathVariable("name") String name) {
		Path target = storageDir.resolve(name);
		if (!Files.exists(target)) {
			return ResponseEntity.notFound().build();
		}
		Resource resource = new FileSystemResource(target.toFile());
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + name + "\"")
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
	}
}


