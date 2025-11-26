package com.backend.common.member.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "MEMBERS")
@org.hibernate.annotations.Comment("사용자(MEMBER) 정보를 저장하는 테이블")
public class MemberEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "MEMBER_ID")
	@Comment("사용자(MEMBER) 고유 식별자 (UUID 형식)")
	private String id;

	@NotBlank
	@Column(name = "USER_NM", unique = true, nullable = false)
	@Comment("사용자명 (로그인 ID)")
	private String username;

	@NotBlank
	@Column(name = "PASSWORD", nullable = false)
	@Comment("암호화된 비밀번호 (BCrypt 해시)")
	private String password;

	@Column(name = "NAME")
	@Comment("사용자 이름")
	private String name;

	@Column(name = "EMAIL")
	@Comment("이메일 주소")
	private String email;

	@Column(name = "AVATAR_URL")
	@Comment("아바타 이미지 URL")
	private String avatarUrl;

	public MemberEntity() {}

	public MemberEntity(String username, String password, String name, String email, String avatarUrl) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.avatarUrl = avatarUrl;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getAvatarUrl() { return avatarUrl; }
	public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}


