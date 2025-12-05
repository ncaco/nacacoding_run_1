package com.backend.common.admin.userRole.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "USER_ROLE")
@org.hibernate.annotations.Comment("사용자 역할 정보를 저장하는 테이블")
public class UserRoleEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "USER_ROLE_ID")
	@org.hibernate.annotations.Comment("사용자 역할 고유 식별자 (UUID 형식)")
	private String id;

	@NotBlank
	@Column(name = "ROLE_CD", nullable = false, unique = true, length = 50)
	@org.hibernate.annotations.Comment("역할 코드 (예: ADMIN, MANAGER, OPERATOR, MEMBER)")
	private String roleCd;

	@NotBlank
	@Column(name = "ROLE_NM", nullable = false)
	@org.hibernate.annotations.Comment("역할명")
	private String roleNm;

	@Column(name = "ROLE_DESC", length = 1000)
	@org.hibernate.annotations.Comment("역할 설명")
	private String roleDesc;

	@Column(name = "USE_YN", nullable = false)
	@org.hibernate.annotations.Comment("활성화 여부 (기본값: true)")
	private Boolean enabled = true;

	public UserRoleEntity() {}

	public UserRoleEntity(String roleCd, String roleNm, String roleDesc) {
		this.roleCd = roleCd;
		this.roleNm = roleNm;
		this.roleDesc = roleDesc;
		this.enabled = true;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getRoleCd() { return roleCd; }
	public void setRoleCd(String roleCd) { this.roleCd = roleCd; }
	public String getRoleNm() { return roleNm; }
	public void setRoleNm(String roleNm) { this.roleNm = roleNm; }
	public String getRoleDesc() { return roleDesc; }
	public void setRoleDesc(String roleDesc) { this.roleDesc = roleDesc; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

