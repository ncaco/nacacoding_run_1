package com.backend.common.user.entity;

import com.backend.common.user.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@NotBlank
	@Column(unique = true, nullable = false)
	private String username;
	
	@NotBlank
	@Column(nullable = false)
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;
	
	@Column
	private String name;
	
	@Column
	private String email;
	
	@Column
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

