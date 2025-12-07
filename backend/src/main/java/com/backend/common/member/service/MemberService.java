package com.backend.common.member.service;

import com.backend.common.member.entity.MemberEntity;
import com.backend.common.member.model.Member;
import com.backend.common.member.repository.MemberRepository;
import com.backend.common.user.entity.UserEntity;
import com.backend.common.user.model.Role;
import com.backend.common.user.repository.UserRepository;
import com.backend.core.exception.DuplicateResourceException;
import com.backend.core.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberService {
	private static final Logger logger = LoggerFactory.getLogger(MemberService.class);
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
	@Transactional(readOnly = true)
	public List<Member> listMembers() {
		logger.debug("사용자 목록 조회");
		return memberRepository.findAll().stream()
				.map(this::toMember)
				.collect(Collectors.toList());
	}

	/**
	 * MEMBERS 테이블에서 username 기준 단일 사용자 조회
	 */
	@Transactional(readOnly = true)
	public Optional<Member> findByUsername(String username) {
		return memberRepository.findByUsername(username)
				.map(this::toMember);
	}

	/**
	 * 로그인한 사용자(MEMBER)의 프로필 수정 (이름, 이메일, 전화번호)
	 * - MEMBERS: name, email, phoneNumber 수정
	 * - USERS  : name, email 동기화
	 */
	@Transactional
	public Member updateMyProfile(String username, String name, String email, String phoneNumber) {
		logger.info("프로필 수정: username={}", username);
		MemberEntity memberEntity = memberRepository.findByUsername(username)
			.orElseThrow(() -> new ResourceNotFoundException("사용자", username));

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

		logger.info("프로필 수정 완료: username={}", username);
		return toMember(savedMember);
	}

	@Transactional(readOnly = true)
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
	@Transactional
	public Member createMember(String username, String password, String name, String email, String phoneNumber, LocalDateTime createdAt) {
		if (memberRepository.existsByUsername(username) || userRepository.existsByUsername(username)) {
			logger.warn("사용자명 중복 시도: {}", username);
			throw new DuplicateResourceException("사용자명", username);
		}
		logger.info("새 사용자 생성: username={}", username);
		String encoded = passwordEncoder.encode(password);
		LocalDateTime joinDateTime = createdAt != null ? createdAt : LocalDateTime.now();

		// USERS 테이블에 MEMBER 계정 생성 (로그인용)
		UserEntity userEntity = new UserEntity(username, encoded, Role.MEMBER, name, email);
		userRepository.save(userEntity);

		// MEMBERS 테이블에 사용자 정보 생성 (관리용)
		MemberEntity memberEntity = new MemberEntity(username, encoded, name, email, phoneNumber, null, joinDateTime);
		MemberEntity saved = memberRepository.save(memberEntity);

		logger.info("사용자 생성 완료: id={}, username={}", saved.getId(), username);
		return toMember(saved);
	}

	/**
	 * MEMBERS + USERS 동시 수정 (이름/이메일 동기화)
	 */
	@Transactional
	public Member updateMember(String id, String name, String email, String phoneNumber) {
		logger.info("사용자 정보 수정: id={}", id);
		MemberEntity memberEntity = memberRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("사용자", id));

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

		logger.info("사용자 정보 수정 완료: id={}", id);
		return toMember(savedMember);
	}

	/**
	 * MEMBERS + USERS 동시 삭제
	 */
	@Transactional
	public void deleteMember(String id) {
		logger.info("사용자 삭제: id={}", id);
		MemberEntity memberEntity = memberRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("사용자", id));

		// USERS 테이블의 MEMBER 계정 삭제
		userRepository.findByUsername(memberEntity.getUsername())
				.filter(u -> u.getRole() == Role.MEMBER)
				.ifPresent(userRepository::delete);

		// MEMBERS 테이블 삭제
		memberRepository.delete(memberEntity);
		logger.info("사용자 삭제 완료: id={}", id);
	}

	/**
	 * 마지막 로그인 일시 업데이트
	 */
	@Transactional
	public void updateLastLogin(String username) {
		memberRepository.findByUsername(username)
				.ifPresent(entity -> {
					entity.setLastLoginAt(LocalDateTime.now());
					memberRepository.save(entity);
					logger.debug("마지막 로그인 일시 업데이트: username={}", username);
				});
	}

	/**
	 * 사용자(MEMBER) 비밀번호 변경
	 * - 현재 비밀번호 검증 후 USERS + MEMBERS 동시 변경
	 */
	@Transactional
	public void changePassword(String username, String currentPassword, String newPassword) {
		logger.info("비밀번호 변경 시도: username={}", username);
		// USERS 테이블에서 사용자 조회
		UserEntity userEntity = userRepository.findByUsername(username)
			.filter(u -> u.getRole() == Role.MEMBER)
			.orElseThrow(() -> new ResourceNotFoundException("사용자", username));

		// 현재 비밀번호 확인
		if (!passwordEncoder.matches(currentPassword, userEntity.getPassword())) {
			logger.warn("비밀번호 불일치: username={}", username);
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
		logger.info("비밀번호 변경 완료: username={}", username);
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

