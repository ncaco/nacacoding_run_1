package com.backend.common.member.memberRole.service;

import com.backend.common.member.memberRole.dto.MemberRoleCreateRequest;
import com.backend.common.member.memberRole.dto.MemberRoleUpdateRequest;
import com.backend.common.member.memberRole.entity.MemberRoleEntity;
import com.backend.common.member.memberRole.model.MemberRole;
import com.backend.common.member.memberRole.repository.MemberRoleRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberRoleService {
	private final MemberRoleRepository memberRoleRepository;

	public MemberRoleService(MemberRoleRepository memberRoleRepository) {
		this.memberRoleRepository = memberRoleRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void init() {
		// 초기 역할 데이터 생성 (이미 존재하면 생성하지 않음)
		if (!memberRoleRepository.existsByRoleCd("VIP")) {
			memberRoleRepository.save(new MemberRoleEntity("VIP", "VIP 회원", "VIP 회원 권한"));
		}
		if (!memberRoleRepository.existsByRoleCd("PREMIUM")) {
			memberRoleRepository.save(new MemberRoleEntity("PREMIUM", "프리미엄 회원", "프리미엄 회원 권한"));
		}
		if (!memberRoleRepository.existsByRoleCd("BASIC")) {
			memberRoleRepository.save(new MemberRoleEntity("BASIC", "일반 회원", "일반 회원 권한"));
		}
		if (!memberRoleRepository.existsByRoleCd("GUEST")) {
			memberRoleRepository.save(new MemberRoleEntity("GUEST", "비회원", "비회원 권한"));
		}
	}

	public List<MemberRole> listMemberRoles() {
		return memberRoleRepository.findAllByOrderByRoleCdAsc().stream()
				.map(this::toMemberRole)
				.collect(Collectors.toList());
	}

	public List<MemberRole> listEnabledMemberRoles() {
		return memberRoleRepository.findByEnabledTrueOrderByRoleCdAsc().stream()
				.map(this::toMemberRole)
				.collect(Collectors.toList());
	}

	public Optional<MemberRole> findById(String id) {
		return memberRoleRepository.findById(id)
				.map(this::toMemberRole);
	}

	public Optional<MemberRole> findByRoleCd(String roleCd) {
		return memberRoleRepository.findByRoleCd(roleCd)
				.map(this::toMemberRole);
	}

	public MemberRole createMemberRole(MemberRoleCreateRequest request) {
		if (memberRoleRepository.existsByRoleCd(request.getRoleCd())) {
			throw new IllegalArgumentException("이미 존재하는 역할 코드입니다: " + request.getRoleCd());
		}

		MemberRoleEntity entity = new MemberRoleEntity(
			request.getRoleCd(),
			request.getRoleNm(),
			request.getRoleDesc()
		);
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		MemberRoleEntity saved = memberRoleRepository.save(entity);
		return toMemberRole(saved);
	}

	public MemberRole updateMemberRole(String id, MemberRoleUpdateRequest request) {
		MemberRoleEntity entity = memberRoleRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("역할을 찾을 수 없습니다: " + id));

		entity.setRoleNm(request.getRoleNm());
		entity.setRoleDesc(request.getRoleDesc());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		MemberRoleEntity saved = memberRoleRepository.save(entity);
		return toMemberRole(saved);
	}

	public void deleteMemberRole(String id) {
		if (!memberRoleRepository.existsById(id)) {
			throw new IllegalArgumentException("역할을 찾을 수 없습니다: " + id);
		}

		// TODO: 해당 역할을 사용하는 사용자가 있는지 확인 후 삭제 제한 필요
		memberRoleRepository.deleteById(id);
	}

	private MemberRole toMemberRole(MemberRoleEntity entity) {
		return new MemberRole(
			entity.getId(),
			entity.getRoleCd(),
			entity.getRoleNm(),
			entity.getRoleDesc(),
			entity.getEnabled()
		);
	}
}

