package com.backend.common.admin.userRoleMenu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "USER_ROLE_MENU")
@org.hibernate.annotations.Comment("사용자 역할별 메뉴 권한 정보를 저장하는 테이블")
public class UserRoleMenuEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "USER_ROLE_MENU_ID")
	@Comment("사용자 역할 메뉴 고유 식별자 (UUID 형식)")
	private String id;

	@Column(name = "USER_ROLE_ID", nullable = false)
	@Comment("사용자 역할 ID (USER_ROLE 테이블 참조)")
	private String userRoleId;

	@Column(name = "MENU_ID", nullable = false)
	@Comment("메뉴 ID (MENUS 테이블 참조)")
	private String menuId;

	@Column(name = "PERM_READ", nullable = false, length = 1)
	@Comment("읽기 권한 (Y/N, 기본값: N)")
	private String permRead = "N";

	@Column(name = "PERM_CREATE", nullable = false, length = 1)
	@Comment("등록 권한 (Y/N, 기본값: N)")
	private String permCreate = "N";

	@Column(name = "PERM_UPDATE", nullable = false, length = 1)
	@Comment("수정 권한 (Y/N, 기본값: N)")
	private String permUpdate = "N";

	@Column(name = "PERM_DELETE", nullable = false, length = 1)
	@Comment("삭제 권한 (Y/N, 기본값: N)")
	private String permDelete = "N";

	@Column(name = "PERM_DOWNLOAD", nullable = false, length = 1)
	@Comment("다운로드 권한 (Y/N, 기본값: N)")
	private String permDownload = "N";

	@Column(name = "PERM_ALL", nullable = false, length = 1)
	@Comment("전체 권한 (Y/N, 기본값: N)")
	private String permAll = "N";

	@Column(name = "USE_YN", nullable = false, length = 1)
	@Comment("활성화 여부 (Y/N, 기본값: Y)")
	private String enabled = "Y";

	public UserRoleMenuEntity() {}

	public UserRoleMenuEntity(String userRoleId, String menuId) {
		this.userRoleId = userRoleId;
		this.menuId = menuId;
		this.permRead = "N";
		this.permCreate = "N";
		this.permUpdate = "N";
		this.permDelete = "N";
		this.permDownload = "N";
		this.permAll = "N";
		this.enabled = "Y";
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
	public String getMenuId() { return menuId; }
	public void setMenuId(String menuId) { this.menuId = menuId; }
	public String getPermRead() { return permRead; }
	public void setPermRead(String permRead) { this.permRead = permRead != null ? permRead : "N"; }
	public String getPermCreate() { return permCreate; }
	public void setPermCreate(String permCreate) { this.permCreate = permCreate != null ? permCreate : "N"; }
	public String getPermUpdate() { return permUpdate; }
	public void setPermUpdate(String permUpdate) { this.permUpdate = permUpdate != null ? permUpdate : "N"; }
	public String getPermDelete() { return permDelete; }
	public void setPermDelete(String permDelete) { this.permDelete = permDelete != null ? permDelete : "N"; }
	public String getPermDownload() { return permDownload; }
	public void setPermDownload(String permDownload) { this.permDownload = permDownload != null ? permDownload : "N"; }
	public String getPermAll() { return permAll; }
	public void setPermAll(String permAll) { this.permAll = permAll != null ? permAll : "N"; }
	public String getEnabled() { return enabled; }
	public void setEnabled(String enabled) { this.enabled = enabled != null ? enabled : "Y"; }
	
	// Boolean 변환 헬퍼 메서드
	public boolean isPermRead() { return "Y".equals(permRead); }
	public boolean isPermCreate() { return "Y".equals(permCreate); }
	public boolean isPermUpdate() { return "Y".equals(permUpdate); }
	public boolean isPermDelete() { return "Y".equals(permDelete); }
	public boolean isPermDownload() { return "Y".equals(permDownload); }
	public boolean isPermAll() { return "Y".equals(permAll); }
	public boolean isEnabled() { return "Y".equals(enabled); }
}

