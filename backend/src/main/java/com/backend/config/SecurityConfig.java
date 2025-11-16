package com.backend.config;

import com.backend.common.auth.security.CustomUserDetailsService;
import com.backend.common.auth.security.JwtAuthFilter;
import com.backend.common.auth.security.JwtUtil;
import com.backend.common.auth.security.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

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
		// BCrypt 해시를 사용해 비밀번호를 안전하게 저장/검증
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil, 
	                                               CustomUserDetailsService userDetailsService,
	                                               PasswordEncoder passwordEncoder,
	                                               TokenBlacklistService tokenBlacklistService,
	                                               CustomAuthenticationEntryPoint authenticationEntryPoint,
	                                               CustomAccessDeniedHandler accessDeniedHandler) throws Exception {
		AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
		authManagerBuilder
			.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder);

		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
					.requestMatchers(
						"/",
						"/api/v1/auth/login/**",
						"/api/v1/auth/refresh",
						"/api/v1/auth/forgot-password",
						"/actuator/health",
						"/h2-console/**",
						"/swagger-ui/**",
						"/swagger-ui.html",
						"/v3/api-docs/**",
						"/swagger-resources/**",
						"/webjars/**"
					).permitAll()
					.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
					.requestMatchers("/api/v1/admin/profile/**").hasRole("USER")
					.requestMatchers("/api/v1/users/**").hasRole("USER")
					.requestMatchers("/api/v1/site/**").hasRole("USER")
					.requestMatchers("/api/v1/menu/**").hasRole("USER")
					.requestMatchers("/api/v1/cmn-cd/**").hasRole("USER")
					.anyRequest().authenticated()
			)
			.exceptionHandling(exceptions -> exceptions
					.authenticationEntryPoint(authenticationEntryPoint)
					.accessDeniedHandler(accessDeniedHandler)
			);

		http.addFilterBefore(new JwtAuthFilter(jwtUtil, tokenBlacklistService), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
		configuration.setMaxAge(3600L);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}


