package com.backend.config;

import com.backend.core.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper = new ObjectMapper();
	
	// permitAll()로 설정된 경로 목록
	private static final List<String> PERMIT_ALL_PATHS = Arrays.asList(
		"/api/v1/auth/login/",
		"/api/v1/auth/forgot-password"
	);

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
	                   AuthenticationException authException) throws IOException, ServletException {
		String requestPath = request.getRequestURI();
		
		// permitAll() 경로인 경우 인증 오류를 발생시키지 않음
		// 컨트롤러에서 직접 토큰 검증을 수행하므로 여기서는 통과시킴
		boolean isPermitAllPath = PERMIT_ALL_PATHS.stream()
			.anyMatch(path -> requestPath.startsWith(path));
		
		if (isPermitAllPath) {
			// permitAll() 경로는 인증 없이도 접근 가능하므로 여기서는 통과
			// 실제 인증은 컨트롤러에서 처리
			return;
		}
		
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		
		ApiResponse<Void> apiResponse = ApiResponse.error("인증이 필요합니다. 로그인 후 다시 시도해주세요.");
		objectMapper.writeValue(response.getWriter(), apiResponse);
	}
}

