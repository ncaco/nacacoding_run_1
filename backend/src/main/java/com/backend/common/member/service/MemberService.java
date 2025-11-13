package com.backend.common.member.service;

import com.backend.common.member.model.Member;
import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MemberService {
	private final UserRepository userRepository;

	public MemberService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<Member> listMembers() {
		return userRepository.findAll().stream()
				.filter(u -> u.getRole() == Role.MEMBER)
				.map(this::toMember)
				.collect(Collectors.toList());
	}

	private Member toMember(UserEntity entity) {
		return new Member(entity.getId(), entity.getUsername(), entity.getPassword());
	}
}

