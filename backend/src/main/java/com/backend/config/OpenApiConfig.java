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
				.tags(List.of(
						new Tag().name("인증").description("로그인/로그아웃 API"),
						new Tag().name("관리자").description("관리자(USER) 전용 API"),
						new Tag().name("사용자").description("사용자(MEMBER) 관리 API"),
						new Tag().name("사이트 관리").description("사이트 CRUD 관리 API"),
						new Tag().name("메뉴 관리").description("메뉴 CRUD 관리 API"),
						new Tag().name("파일").description("파일 업로드/다운로드 API"),
						new Tag().name("로그").description("로그 관리 API")
				))
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
}

