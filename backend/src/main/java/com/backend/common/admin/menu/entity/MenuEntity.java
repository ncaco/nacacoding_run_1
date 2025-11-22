package com.backend.common.admin.menu.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "MENUS")
@org.hibernate.annotations.Comment("메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)")
public class MenuEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "MENU_ID")
	@Comment("메뉴 고유 식별자 (UUID 형식)")
	private String id;
	
	@Column(name = "SITE_ID", nullable = false)
	@Comment("사이트 ID (SITES 테이블 참조)")
	private String siteId;
	
	@NotBlank
	@Column(name = "MENU_NM", nullable = false)
	@Comment("메뉴명")
	private String name;
	
	@Column(name = "MENU_URL", length = 500)
	@Comment("메뉴 URL")
	private String url;
	
	@Column(name = "ICON_ID", length = 100)
	@Comment("메뉴 아이콘 ID (ICONS 테이블의 ICON_CD 참조)")
	private String icon;
	
	@Column(name = "DISP_ORD", nullable = false)
	@Comment("표시 순서")
	private Integer displayOrder = 0;
	
	@Column(name = "PARENT_ID")
	@Comment("부모 메뉴 ID (계층 구조용, 최상위 메뉴는 NULL)")
	private String parentId;
	
	@Column(name = "USE_YN", nullable = false)
	@Comment("활성화 여부 (기본값: true)")
	private Boolean enabled = true;
	
	public MenuEntity() {}
	
	public MenuEntity(String siteId, String name, String url, String icon, Integer displayOrder, String parentId) {
		this.siteId = siteId;
		this.name = name;
		this.url = url;
		this.icon = icon;
		this.displayOrder = displayOrder != null ? displayOrder : 0;
		this.parentId = parentId;
		this.enabled = true;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getSiteId() { return siteId; }
	public void setSiteId(String siteId) { this.siteId = siteId; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getUrl() { return url; }
	public void setUrl(String url) { this.url = url; }
	public String getIcon() { return icon; }
	public void setIcon(String icon) { this.icon = icon; }
	public Integer getDisplayOrder() { return displayOrder; }
	public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
	public String getParentId() { return parentId; }
	public void setParentId(String parentId) { this.parentId = parentId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

