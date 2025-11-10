package com.backend.common.user.service;

import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class UserService {
	private final Map<String, User> usersByUsername = new ConcurrentHashMap<>();

	public UserService() {
		createUser("admin", "admin123", Role.ADMIN);
		createUser("user", "user123", Role.USER);
	}

	public Optional<User> findByUsername(String username) {
		return Optional.ofNullable(usersByUsername.get(username));
	}

	public User createUser(String username, String password, Role role) {
		User user = new User(UUID.randomUUID().toString(), username, password, role);
		usersByUsername.put(username, user);
		return user;
	}

	public List<User> listUsers() {
		return usersByUsername.values().stream().collect(Collectors.toList());
	}
}


