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
import com.backend.core.constants.Constants;
import com.backend.core.exception.DuplicateResourceException;
import com.backend.core.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class UserService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
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
	@Transactional
	public void init() {
		logger.info("초기 사용자 계정 생성 시작");
		// 초기 계정 생성 (이미 존재하면 생성하지 않음)
		// ApplicationReadyEvent를 사용하여 모든 빈이 준비된 후 실행
		
		// 관리자 계정 생성
		if (!userRepository.existsByUsername("admin")) {
			logger.info("관리자 계정 생성 중");
			// 최고관리자 역할 찾기 (없으면 생성)
			Optional<UserRoleEntity> adminRoleOpt = userRoleRepository.findByRoleCd(Constants.ROLE_ADMIN);
			String adminRoleId;
			if (adminRoleOpt.isPresent()) {
				adminRoleId = adminRoleOpt.get().getId();
			} else {
				// 최고관리자 역할이 없으면 생성
				UserRoleEntity adminRole = new UserRoleEntity(Constants.ROLE_ADMIN, "최고 관리자", "모든 권한을 가진 최고 관리자");
				UserRoleEntity savedRole = userRoleRepository.save(adminRole);
				adminRoleId = savedRole.getId();
				logger.info("최고관리자 역할 생성 완료: {}", adminRoleId);
			}
			
			// 최고관리자 역할 ID와 함께 사용자 생성
			createUser("admin", "admin123", Role.USER, "관리자", "admin@example.com", adminRoleId);
			
			// 최고관리자 역할에 모든 메뉴에 대한 권한 부여
			grantAllPermissionsToRole(adminRoleId);
			logger.info("관리자 계정 생성 완료");
		}
		
		// 사용자 계정 생성
		if (!userRepository.existsByUsername("member")) {
			logger.info("사용자 계정 생성 중");
			createUser("member", "member123", Role.MEMBER); // 사용자
			logger.info("사용자 계정 생성 완료");
		}
		logger.info("초기 사용자 계정 생성 완료");
	}
	
	/**
	 * 특정 역할에 모든 메뉴에 대한 전체 권한 부여
	 */
	@Transactional
	private void grantAllPermissionsToRole(String userRoleId) {
		// 모든 활성화된 메뉴 조회
		List<MenuEntity> allMenus = menuRepository.findAll().stream()
			.filter(menu -> menu.getEnabled() != null && menu.getEnabled())
			.collect(Collectors.toList());
		
		logger.debug("역할 {}에 {}개의 메뉴 권한 부여 중", userRoleId, allMenus.size());
		
		// 각 메뉴에 대해 전체 권한 부여
		for (MenuEntity menu : allMenus) {
			UserRoleMenuEntity permission = new UserRoleMenuEntity(userRoleId, menu.getId());
			permission.setPermRead(Constants.PERM_READ);
			permission.setPermCreate(Constants.PERM_CREATE);
			permission.setPermUpdate(Constants.PERM_UPDATE);
			permission.setPermDelete(Constants.PERM_DELETE);
			permission.setPermDownload(Constants.PERM_DOWNLOAD);
			permission.setPermAll(Constants.PERM_ALL);
			permission.setEnabled(Constants.PERM_ENABLED);
			userRoleMenuRepository.save(permission);
		}
		logger.debug("역할 {}에 메뉴 권한 부여 완료", userRoleId);
	}

	@Transactional(readOnly = true)
	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username)
				.map(this::toUser);
	}

	@Transactional
	public User createUser(String username, String password, Role role) {
		return createUser(username, password, role, null, null);
	}

	@Transactional
	public User createUser(String username, String password, Role role, String name, String email) {
		return createUser(username, password, role, name, email, null);
	}
	
	@Transactional
	public User createUser(String username, String password, Role role, String name, String email, String userRoleId) {
		if (userRepository.existsByUsername(username)) {
			logger.warn("사용자명 중복 시도: {}", username);
			throw new DuplicateResourceException("사용자명", username);
		}
		logger.info("새 사용자 생성: username={}, role={}", username, role);
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
		logger.info("사용자 생성 완료: id={}, username={}", saved.getId(), username);
		return toUser(saved);
	}

	@Transactional(readOnly = true)
	public List<User> listUsers() {
		logger.debug("관리자 목록 조회");
		// 관리자(USER 역할)만 조회
		return userRepository.findAll().stream()
				.filter(u -> u.getRole() == Role.USER)
				.map(this::toUser)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public Optional<User> findById(String id) {
		return userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.map(this::toUser);
	}

	@Transactional
	public User updateUser(String id, String name, String email) {
		return updateUser(id, name, email, null);
	}
	
	@Transactional
	public User updateUser(String id, String name, String email, String userRoleId) {
		logger.info("사용자 정보 수정: id={}", id);
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.orElseThrow(() -> new ResourceNotFoundException("관리자", id));
		entity.setName(name);
		entity.setEmail(email);
		if (userRoleId != null) {
			entity.setUserRoleId(userRoleId);
		}
		UserEntity saved = userRepository.save(entity);
		logger.info("사용자 정보 수정 완료: id={}", id);
		return toUser(saved);
	}

	@Transactional
	public void deleteUser(String id) {
		logger.info("사용자 삭제: id={}", id);
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.USER)
				.orElseThrow(() -> new ResourceNotFoundException("관리자", id));
		userRepository.delete(entity);
		logger.info("사용자 삭제 완료: id={}", id);
	}

	@Transactional
	public User updateProfile(String username, String name, String email) {
		return updateProfile(username, name, email, null);
	}
	
	@Transactional
	public User updateProfile(String username, String name, String email, String avatarUrl) {
		logger.info("프로필 수정: username={}", username);
		UserEntity entity = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("사용자", username));
		entity.setName(name);
		entity.setEmail(email);
		if (avatarUrl != null) {
			entity.setAvatarUrl(avatarUrl);
		}
		UserEntity saved = userRepository.save(entity);
		logger.info("프로필 수정 완료: username={}", username);
		return toUser(saved);
	}

	@Transactional
	public void changePassword(String username, String currentPassword, String newPassword) {
		logger.info("비밀번호 변경 시도: username={}", username);
		UserEntity entity = userRepository.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("사용자", username));
		
		// 현재 비밀번호 확인
		if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
			logger.warn("비밀번호 불일치: username={}", username);
			throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
		}
		
		// 새 비밀번호 암호화 및 저장
		String encoded = passwordEncoder.encode(newPassword);
		entity.setPassword(encoded);
		userRepository.save(entity);
		logger.info("비밀번호 변경 완료: username={}", username);
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


