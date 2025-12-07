package com.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
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
						.description("""
							# Backend API 문서
							
							이 API는 관리자 및 사용자 관리를 위한 RESTful API입니다.
							
							## 인증 방식
							- JWT(JSON Web Token) 기반 인증을 사용합니다.
							- 로그인 API를 통해 Access Token과 Refresh Token을 발급받습니다.
							- 인증이 필요한 API는 Authorization 헤더에 Bearer 토큰을 포함해야 합니다.
							
							## 사용 방법
							1. 로그인 API로 토큰을 발급받습니다.
							2. 발급받은 Access Token을 Authorization 헤더에 포함하여 API를 호출합니다.
							3. Access Token이 만료되면 Refresh Token을 사용하여 갱신합니다.
							
							## 권한
							- **USER**: 관리자 권한 (모든 API 접근 가능)
							- **MEMBER**: 사용자 권한 (일부 API만 접근 가능)
							""")
						.contact(new Contact()
								.name("Backend Team")
								.email("support@example.com"))
						.license(new License()
								.name("Apache 2.0")
								.url("https://www.apache.org/licenses/LICENSE-2.0.html")))
				.servers(List.of(
					new Server().url("http://localhost:8080").description("로컬 개발 서버"),
					new Server().url("https://api.example.com").description("프로덕션 서버")
				))
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
										.description("JWT 토큰을 입력하세요. 로그인 API로 토큰을 발급받을 수 있습니다.\n\n예시: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")));
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
			new Tag().name("07_메뉴").description("메뉴 CRUD 관리 API"),
			new Tag().name("08_프로필").description("관리자 프로필 관리 API"),
			new Tag().name("09_공통코드").description("공통코드 CRUD 관리 API"),
			new Tag().name("10_아이콘").description("아이콘 CRUD 관리 API"),
			new Tag().name("11_사용자역할").description("사용자 역할(USER_ROLE) 관리 API"),
			new Tag().name("12_사용자역할메뉴").description("사용자 역할별 메뉴 권한 관리 API"),
			new Tag().name("13_사용자역할").description("사용자 역할(MEMBER_ROLE) 관리 API"),
			new Tag().name("14_사용자역할메뉴").description("사용자 역할별 메뉴 권한 관리 API")
		);
	}
}

