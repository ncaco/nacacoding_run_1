package com.backend.common.admin.userRole.service;

import com.backend.common.admin.userRole.dto.UserRoleCreateRequest;
import com.backend.common.admin.userRole.dto.UserRoleUpdateRequest;
import com.backend.common.admin.userRole.entity.UserRoleEntity;
import com.backend.common.admin.userRole.model.UserRole;
import com.backend.common.admin.userRole.repository.UserRoleRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserRoleService {
	private final UserRoleRepository userRoleRepository;

	public UserRoleService(UserRoleRepository userRoleRepository) {
		this.userRoleRepository = userRoleRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void init() {
		// 초기 역할 데이터 생성 (이미 존재하면 생성하지 않음)
		if (!userRoleRepository.existsByRoleCd("ADMIN")) {
			userRoleRepository.save(new UserRoleEntity("ADMIN", "최고 관리자", "모든 권한을 가진 최고 관리자"));
		}
		if (!userRoleRepository.existsByRoleCd("MANAGER")) {
			userRoleRepository.save(new UserRoleEntity("MANAGER", "관리자", "사이트, 메뉴, 사용자 관리 권한"));
		}
		if (!userRoleRepository.existsByRoleCd("OPERATOR")) {
			userRoleRepository.save(new UserRoleEntity("OPERATOR", "운영자", "파일, 로그 관리 권한"));
		}
		if (!userRoleRepository.existsByRoleCd("MEMBER")) {
			userRoleRepository.save(new UserRoleEntity("MEMBER", "일반 사용자", "일반 사용자 권한"));
		}
	}

	public List<UserRole> listUserRoles() {
		return userRoleRepository.findAllByOrderByRoleCdAsc().stream()
				.map(this::toUserRole)
				.collect(Collectors.toList());
	}

	public List<UserRole> listEnabledUserRoles() {
		return userRoleRepository.findByEnabledTrueOrderByRoleCdAsc().stream()
				.map(this::toUserRole)
				.collect(Collectors.toList());
	}

	public Optional<UserRole> findById(String id) {
		return userRoleRepository.findById(id)
				.map(this::toUserRole);
	}

	public Optional<UserRole> findByRoleCd(String roleCd) {
		return userRoleRepository.findByRoleCd(roleCd)
				.map(this::toUserRole);
	}

	public UserRole createUserRole(UserRoleCreateRequest request) {
		if (userRoleRepository.existsByRoleCd(request.getRoleCd())) {
			throw new IllegalArgumentException("이미 존재하는 역할 코드입니다: " + request.getRoleCd());
		}

		UserRoleEntity entity = new UserRoleEntity(
			request.getRoleCd(),
			request.getRoleNm(),
			request.getRoleDesc()
		);
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		UserRoleEntity saved = userRoleRepository.save(entity);
		return toUserRole(saved);
	}

	public UserRole updateUserRole(String id, UserRoleUpdateRequest request) {
		UserRoleEntity entity = userRoleRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("역할을 찾을 수 없습니다: " + id));

		entity.setRoleNm(request.getRoleNm());
		entity.setRoleDesc(request.getRoleDesc());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		UserRoleEntity saved = userRoleRepository.save(entity);
		return toUserRole(saved);
	}

	public void deleteUserRole(String id) {
		UserRoleEntity entity = userRoleRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("역할을 찾을 수 없습니다: " + id));

		// TODO: 해당 역할을 사용하는 사용자가 있는지 확인 후 삭제 제한 필요
		userRoleRepository.deleteById(id);
	}

	private UserRole toUserRole(UserRoleEntity entity) {
		return new UserRole(
			entity.getId(),
			entity.getRoleCd(),
			entity.getRoleNm(),
			entity.getRoleDesc(),
			entity.getEnabled()
		);
	}
}

