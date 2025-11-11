package com.backend.common.user.service;

import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class UserService {
	private final Map<String, User> usersByUsername = new ConcurrentHashMap<>();
	private final PasswordEncoder passwordEncoder;

	public UserService(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
		// 초기 계정 생성 시 암호화 적용
		createUser("admin", "admin123", Role.ADMIN);
		createUser("user", "user123", Role.USER);
	}

	public Optional<User> findByUsername(String username) {
		return Optional.ofNullable(usersByUsername.get(username));
	}

	public User createUser(String username, String password, Role role) {
		String encoded = passwordEncoder.encode(password);
		User user = new User(UUID.randomUUID().toString(), username, encoded, role);
		usersByUsername.put(username, user);
		return user;
	}

	public List<User> listUsers() {
		return usersByUsername.values().stream().collect(Collectors.toList());
	}
}


