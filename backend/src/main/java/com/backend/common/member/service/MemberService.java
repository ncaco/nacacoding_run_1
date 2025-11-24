package com.backend.common.member.service;

import com.backend.common.member.model.Member;
import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public MemberService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public List<Member> listMembers() {
		return userRepository.findAll().stream()
				.filter(u -> u.getRole() == Role.MEMBER)
				.map(this::toMember)
				.collect(Collectors.toList());
	}

	public Optional<Member> findById(String id) {
		return userRepository.findById(id)
				.filter(u -> u.getRole() == Role.MEMBER)
				.map(this::toMember);
	}

	public Member createMember(String username, String password, String name, String email) {
		if (userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already exists: " + username);
		}
		String encoded = passwordEncoder.encode(password);
		UserEntity entity = new UserEntity(username, encoded, Role.MEMBER, name, email);
		UserEntity saved = userRepository.save(entity);
		return toMember(saved);
	}

	public Member updateMember(String id, String name, String email) {
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.MEMBER)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id));
		entity.setName(name);
		entity.setEmail(email);
		UserEntity saved = userRepository.save(entity);
		return toMember(saved);
	}

	public void deleteMember(String id) {
		UserEntity entity = userRepository.findById(id)
				.filter(u -> u.getRole() == Role.MEMBER)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id));
		userRepository.delete(entity);
	}

	private Member toMember(UserEntity entity) {
		return new Member(
			entity.getId(),
			entity.getUsername(),
			entity.getPassword(),
			entity.getName(),
			entity.getEmail(),
			entity.getAvatarUrl()
		);
	}
}

