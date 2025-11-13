package com.backend.common.file.controller;

import com.backend.core.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "파일", description = "파일 업로드/다운로드 API")
public class FileController {
	private final Path storageDir = Path.of(System.getProperty("java.io.tmpdir"), "uploads");

	@Operation(summary = "파일 업로드", description = "파일을 업로드하고 저장된 파일명을 반환합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "업로드 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Map<String, Object>>> upload(@RequestPart("file") MultipartFile file) throws IOException {
		Files.createDirectories(storageDir);
		String stored = UUID.randomUUID() + "_" + file.getOriginalFilename();
		Path target = storageDir.resolve(stored);
		Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
		return ResponseEntity.ok(ApiResponse.ok(Map.of("filename", stored, "size", file.getSize())));
	}

	@Operation(summary = "파일 다운로드", description = "저장된 파일을 다운로드합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "다운로드 성공", content = @Content(mediaType = "application/octet-stream")),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "파일을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
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


