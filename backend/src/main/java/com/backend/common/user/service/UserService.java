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
		return createUser(username, password, role, null, null);
	}

	public User createUser(String username, String password, Role role, String name, String email) {
		return createUser(username, password, role, name, email, null);
	}
	
	public User createUser(String username, String password, Role role, String name, String email, String userRoleId) {
		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already exists: " + username);
		}
		String encoded = passwordEncoder.encode(password);
		UserEntity entity;
		if (name != null || email != null) {
			entity = new UserEntity(username, encoded, role, name, email);
		} else {
			entity = new UserEntity(username, encoded, role);
		}
		if (userRoleId != null && !userRoleId.isEmpty()) {
			entity.setUserRoleId(userRoleId);
		}
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

	public Optional<User> findById(String id) {
		return userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.map(this::toUser);
	}

	public User updateUser(String id, String name, String email) {
		return updateUser(id, name, email, null);
	}
	
	public User updateUser(String id, String name, String email, String userRoleId) {
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다: " + id));
		entity.setName(name);
		entity.setEmail(email);
		if (userRoleId != null) {
			entity.setUserRoleId(userRoleId);
		}
		UserEntity saved = userRepository.save(entity);
		return toUser(saved);
	}

	public void deleteUser(String id) {
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다: " + id));
		userRepository.delete(entity);
	}

	public User updateProfile(String username, String name, String email) {
		UserEntity entity = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));
		entity.setName(name);
		entity.setEmail(email);
		UserEntity saved = userRepository.save(entity);
		return toUser(saved);
	}
	
	public User updateProfile(String username, String name, String email, String avatarUrl) {
		UserEntity entity = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));
		entity.setName(name);
		entity.setEmail(email);
		if (avatarUrl != null) {
			entity.setAvatarUrl(avatarUrl);
		}
		UserEntity saved = userRepository.save(entity);
		return toUser(saved);
	}

	public void changePassword(String username, String currentPassword, String newPassword) {
		UserEntity entity = userRepository.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));
		
		// 현재 비밀번호 확인
		if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
			throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
		}
		
		// 새 비밀번호 암호화 및 저장
		String encoded = passwordEncoder.encode(newPassword);
		entity.setPassword(encoded);
		userRepository.save(entity);
	}

	private User toUser(UserEntity entity) {
		return new User(
			entity.getId(),
			entity.getUsername(),
			entity.getPassword(),
			entity.getRole(),
			entity.getName(),
			entity.getEmail(),
			entity.getAvatarUrl(),
			entity.getUserRoleId()
		);
	}
}


