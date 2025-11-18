package com.backend.common.user.entity;

import com.backend.common.user.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "users")
@org.hibernate.annotations.Comment("사용자 및 관리자 정보를 저장하는 테이블")
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Comment("사용자 고유 식별자 (UUID 형식)")
	private String id;
	
	@NotBlank
	@Column(unique = true, nullable = false)
	@Comment("사용자명 (로그인 ID)")
	private String username;
	
	@NotBlank
	@Column(nullable = false)
	@Comment("암호화된 비밀번호 (BCrypt 해시)")
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Comment("사용자 역할 (USER: 관리자, MEMBER: 사용자)")
	private Role role;
	
	@Column
	@Comment("사용자 이름")
	private String name;
	
	@Column
	@Comment("이메일 주소")
	private String email;
	
	@Column
	@Comment("아바타 이미지 URL")
	private String avatarUrl;
	
	public UserEntity() {}
	
	public UserEntity(String username, String password, Role role) {
		this.username = username;
		this.password = password;
		this.role = role;
	}
	
	public UserEntity(String username, String password, Role role, String name, String email) {
		this.username = username;
		this.password = password;
		this.role = role;
		this.name = name;
		this.email = email;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	public Role getRole() { return role; }
	public void setRole(Role role) { this.role = role; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getAvatarUrl() { return avatarUrl; }
	public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}

