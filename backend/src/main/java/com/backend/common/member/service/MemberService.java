package com.backend.common.member.service;

import com.backend.common.member.entity.MemberEntity;
import com.backend.common.member.model.Member;
import com.backend.common.member.repository.MemberRepository;
import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberService {
	private final MemberRepository memberRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public MemberService(MemberRepository memberRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.memberRepository = memberRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * MEMBERS 테이블 기준 사용자(MEMBER) 목록 조회
	 */
	public List<Member> listMembers() {
		return memberRepository.findAll().stream()
				.map(this::toMember)
				.collect(Collectors.toList());
	}

	/**
	 * MEMBERS 테이블에서 username 기준 단일 사용자 조회
	 */
	public Optional<Member> findByUsername(String username) {
		return memberRepository.findByUsername(username)
				.map(this::toMember);
	}

	/**
	 * 로그인한 사용자(MEMBER)의 프로필 수정 (이름, 이메일, 전화번호)
	 * - MEMBERS: name, email, phoneNumber 수정
	 * - USERS  : name, email 동기화
	 */
	public Member updateMyProfile(String username, String name, String email, String phoneNumber) {
		MemberEntity memberEntity = memberRepository.findByUsername(username)
			.orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다: " + username));

		memberEntity.setName(name);
		memberEntity.setEmail(email);
		memberEntity.setPhoneNumber(phoneNumber);
		MemberEntity savedMember = memberRepository.save(memberEntity);

		// USERS 테이블에도 동일 username 사용 시 동기화
		userRepository.findByUsername(memberEntity.getUsername())
			.filter(u -> u.getRole() == Role.MEMBER)
			.ifPresent(u -> {
				u.setName(name);
				u.setEmail(email);
				userRepository.save(u);
			});

		return toMember(savedMember);
	}

	public Optional<Member> findById(String id) {
		return memberRepository.findById(id)
				.map(this::toMember);
	}

	/**
	 * MEMBERS + USERS 동시 생성
	 * - MEMBERS: 사용자 관리(목록/수정/삭제)용
	 * - USERS  : 인증/권한(Role.MEMBER)용
	 * @param createdAt 가입 일시 (null 인 경우 현재 시간으로 설정)
	 */
	public Member createMember(String username, String password, String name, String email, String phoneNumber, LocalDateTime createdAt) {
		if (memberRepository.existsByUsername(username) || userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("Username already exists: " + username);
		}
		String encoded = passwordEncoder.encode(password);
		LocalDateTime joinDateTime = createdAt != null ? createdAt : LocalDateTime.now();

		// USERS 테이블에 MEMBER 계정 생성 (로그인용)
		UserEntity userEntity = new UserEntity(username, encoded, Role.MEMBER, name, email);
		userRepository.save(userEntity);

		// MEMBERS 테이블에 사용자 정보 생성 (관리용)
		MemberEntity memberEntity = new MemberEntity(username, encoded, name, email, phoneNumber, null, joinDateTime);
		MemberEntity saved = memberRepository.save(memberEntity);

		return toMember(saved);
	}

	/**
	 * MEMBERS + USERS 동시 수정 (이름/이메일 동기화)
	 */
	public Member updateMember(String id, String name, String email, String phoneNumber) {
		MemberEntity memberEntity = memberRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id));

		memberEntity.setName(name);
		memberEntity.setEmail(email);
		memberEntity.setPhoneNumber(phoneNumber);
		MemberEntity savedMember = memberRepository.save(memberEntity);

		// USERS 테이블에도 동일 username 사용 시 동기화
		userRepository.findByUsername(memberEntity.getUsername())
				.filter(u -> u.getRole() == Role.MEMBER)
				.ifPresent(u -> {
					u.setName(name);
					u.setEmail(email);
					userRepository.save(u);
				});

		return toMember(savedMember);
	}

	/**
	 * MEMBERS + USERS 동시 삭제
	 */
	public void deleteMember(String id) {
		MemberEntity memberEntity = memberRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + id));

		// USERS 테이블의 MEMBER 계정 삭제
		userRepository.findByUsername(memberEntity.getUsername())
				.filter(u -> u.getRole() == Role.MEMBER)
				.ifPresent(userRepository::delete);

		// MEMBERS 테이블 삭제
		memberRepository.delete(memberEntity);
	}

	/**
	 * 마지막 로그인 일시 업데이트
	 */
	public void updateLastLogin(String username) {
		memberRepository.findByUsername(username)
				.ifPresent(entity -> {
					entity.setLastLoginAt(LocalDateTime.now());
					memberRepository.save(entity);
				});
	}

	/**
	 * 사용자(MEMBER) 비밀번호 변경
	 * - 현재 비밀번호 검증 후 USERS + MEMBERS 동시 변경
	 */
	public void changePassword(String username, String currentPassword, String newPassword) {
		// USERS 테이블에서 사용자 조회
		UserEntity userEntity = userRepository.findByUsername(username)
			.filter(u -> u.getRole() == Role.MEMBER)
			.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

		// 현재 비밀번호 확인
		if (!passwordEncoder.matches(currentPassword, userEntity.getPassword())) {
			throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
		}

		// 새 비밀번호 암호화
		String encoded = passwordEncoder.encode(newPassword);

		// USERS 테이블 비밀번호 변경
		userEntity.setPassword(encoded);
		userRepository.save(userEntity);

		// MEMBERS 테이블도 존재하면 비밀번호 동기화
		memberRepository.findByUsername(username)
			.ifPresent(memberEntity -> {
				memberEntity.setPassword(encoded);
				memberRepository.save(memberEntity);
			});
	}

	private Member toMember(MemberEntity entity) {
		return new Member(
			entity.getId(),
			entity.getUsername(),
			entity.getPassword(),
			entity.getName(),
			entity.getEmail(),
			entity.getPhoneNumber(),
			entity.getAvatarUrl(),
			entity.getCreatedAt(),
			entity.getLastLoginAt()
		);
	}
}

