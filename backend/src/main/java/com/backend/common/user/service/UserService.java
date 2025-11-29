package com.backend.common.user.service;

import com.backend.common.admin.menu.entity.MenuEntity;
import com.backend.common.admin.menu.repository.MenuRepository;
import com.backend.common.admin.userRole.entity.UserRoleEntity;
import com.backend.common.admin.userRole.repository.UserRoleRepository;
import com.backend.common.admin.userRoleMenu.entity.UserRoleMenuEntity;
import com.backend.common.admin.userRoleMenu.repository.UserRoleMenuRepository;
import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
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
	private final UserRoleRepository userRoleRepository;
	private final MenuRepository menuRepository;
	private final UserRoleMenuRepository userRoleMenuRepository;

	public UserService(
		UserRepository userRepository, 
		PasswordEncoder passwordEncoder,
		UserRoleRepository userRoleRepository,
		MenuRepository menuRepository,
		UserRoleMenuRepository userRoleMenuRepository
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.userRoleRepository = userRoleRepository;
		this.menuRepository = menuRepository;
		this.userRoleMenuRepository = userRoleMenuRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	@Order(200) // UserRoleService(기본값 0), MenuService(100)보다 나중에 실행되도록 설정
	public void init() {
		// 초기 계정 생성 (이미 존재하면 생성하지 않음)
		// ApplicationReadyEvent를 사용하여 모든 빈이 준비된 후 실행
		
		// 관리자 계정 생성
		if (!userRepository.existsByUsername("admin")) {
			// 최고관리자 역할 찾기 (없으면 생성)
			Optional<UserRoleEntity> adminRoleOpt = userRoleRepository.findByRoleCd("ADMIN");
			String adminRoleId;
			if (adminRoleOpt.isPresent()) {
				adminRoleId = adminRoleOpt.get().getId();
			} else {
				// 최고관리자 역할이 없으면 생성
				UserRoleEntity adminRole = new UserRoleEntity("ADMIN", "최고 관리자", "모든 권한을 가진 최고 관리자");
				UserRoleEntity savedRole = userRoleRepository.save(adminRole);
				adminRoleId = savedRole.getId();
			}
			
			// 최고관리자 역할 ID와 함께 사용자 생성
			createUser("admin", "admin123", Role.USER, "관리자", "admin@example.com", adminRoleId);
			
			// 최고관리자 역할에 모든 메뉴에 대한 권한 부여
			grantAllPermissionsToRole(adminRoleId);
		}
		
		// 사용자 계정 생성
		if (!userRepository.existsByUsername("member")) {
			createUser("member", "member123", Role.MEMBER); // 사용자
		}
	}
	
	/**
	 * 특정 역할에 모든 메뉴에 대한 전체 권한 부여
	 */
	private void grantAllPermissionsToRole(String userRoleId) {
		// 모든 활성화된 메뉴 조회
		List<MenuEntity> allMenus = menuRepository.findAll().stream()
			.filter(menu -> menu.getEnabled() != null && menu.getEnabled())
			.collect(Collectors.toList());
		
		// 각 메뉴에 대해 전체 권한 부여
		for (MenuEntity menu : allMenus) {
			UserRoleMenuEntity permission = new UserRoleMenuEntity(userRoleId, menu.getId());
			permission.setPermRead("Y");
			permission.setPermCreate("Y");
			permission.setPermUpdate("Y");
			permission.setPermDelete("Y");
			permission.setPermDownload("Y");
			permission.setPermAll("Y");
			permission.setEnabled("Y");
			userRoleMenuRepository.save(permission);
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


