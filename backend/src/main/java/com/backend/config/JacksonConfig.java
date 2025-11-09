package com.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.ZoneId;
import java.util.TimeZone;

@Configuration
public class JacksonConfig {

	@Bean
	@Primary
	public ObjectMapper objectMapper() {
		// JavaTimeModule을 사용하면 자동으로 ISO-8601 형식으로 날짜를 직렬화합니다
		// (타임스탬프가 아닌 문자열 형식)
		return JsonMapper.builder()
				.addModule(new JavaTimeModule())
				.defaultTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Seoul")))
				.build();
	}
}

