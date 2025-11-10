package com.backend.config;

import com.backend.common.auth.security.CustomUserDetailsService;
import com.backend.common.auth.security.JwtAuthFilter;
import com.backend.common.auth.security.JwtUtil;
import com.backend.common.auth.security.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${app.jwt.secret:ZmFrZVNlY3JldEJhc2U2NEtleVNwcg==}")
	private String jwtSecret;

	@Bean
	public JwtUtil jwtUtil() {
		return new JwtUtil(jwtSecret, 3600);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		// 평문 비밀번호 비교를 위한 PasswordEncoder
		// 주의: 프로덕션 환경에서는 BCryptPasswordEncoder 사용 권장
		return new PasswordEncoder() {
			@Override
			public String encode(CharSequence rawPassword) {
				return rawPassword.toString();
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				return rawPassword.toString().equals(encodedPassword);
			}
		};
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil, 
	                                               CustomUserDetailsService userDetailsService,
	                                               PasswordEncoder passwordEncoder,
	                                               TokenBlacklistService tokenBlacklistService) throws Exception {
		AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
		authManagerBuilder
			.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder);

		http
			.csrf(csrf -> csrf.disable())
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
					.requestMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
					.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
					.anyRequest().authenticated()
			)
			.httpBasic(Customizer.withDefaults());

		http.addFilterBefore(new JwtAuthFilter(jwtUtil, tokenBlacklistService), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}


