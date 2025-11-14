package com.backend.common.user.service;

import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void init() {
		// 초기 계정 생성 (이미 존재하면 생성하지 않음)
		// ApplicationReadyEvent를 사용하여 모든 빈이 준비된 후 실행
		if (!userRepository.existsByUsername("admin")) {
			createUser("admin", "admin123", Role.USER); // 관리자
		}
		if (!userRepository.existsByUsername("member")) {
			createUser("member", "member123", Role.MEMBER); // 사용자
		}
	}

	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username)
				.map(this::toUser);
	}

	public User createUser(String username, String password, Role role) {
		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already exists: " + username);
		}
		String encoded = passwordEncoder.encode(password);
		UserEntity entity = new UserEntity(username, encoded, role);
		UserEntity saved = userRepository.save(entity);
		return toUser(saved);
	}

	public List<User> listUsers() {
		// 관리자(USER 역할)만 조회
		return userRepository.findAll().stream()
				.filter(u -> u.getRole() == Role.USER)
				.map(this::toUser)
				.collect(Collectors.toList());
	}

	private User toUser(UserEntity entity) {
		return new User(entity.getId(), entity.getUsername(), entity.getPassword(), entity.getRole());
	}
}


