package com.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		final String securitySchemeName = "bearerAuth";
		
		return new OpenAPI()
				.info(new Info()
						.title("Backend API")
						.version("1.0.0")
						.description("Backend API 서버 문서")
						.contact(new Contact()
								.name("Backend Team")
								.email("support@example.com"))
						.license(new License()
								.name("Apache 2.0")
								.url("https://www.apache.org/licenses/LICENSE-2.0.html")))
				.tags(createTagsInOrder())
				.addSecurityItem(new SecurityRequirement()
						.addList(securitySchemeName))
				.components(new Components()
						.addSecuritySchemes(securitySchemeName,
								new SecurityScheme()
										.name(securitySchemeName)
										.type(SecurityScheme.Type.HTTP)
										.scheme("bearer")
										.bearerFormat("JWT")
										.description("JWT 토큰을 입력하세요. 로그인 API로 토큰을 발급받을 수 있습니다.")));
	}

	private List<Tag> createTagsInOrder() {
		// 태그 순서를 명시적으로 지정 (OpenAPI 스펙에서 정의한 순서대로 표시)
		// Swagger UI는 기본적으로 알파벳 순으로 정렬하므로, 
		// OpenAPI 스펙의 tags 배열 순서가 중요합니다.
		return List.of(
			new Tag().name("01_인증").description("로그인/로그아웃 API"),
			new Tag().name("02_관리자").description("관리자(USER) 전용 API"),
			new Tag().name("03_사용자").description("사용자(MEMBER) 관리 API"),
			new Tag().name("04_로그").description("로그 관리 API"),
			new Tag().name("05_파일").description("파일 업로드/다운로드 API"),
			new Tag().name("06_사이트").description("사이트 CRUD 관리 API"),
			new Tag().name("07_메뉴").description("메뉴 CRUD 관리 API")
		);
	}
}

