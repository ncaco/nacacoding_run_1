package com.backend.common.admin.menu.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "menus")
public class MenuEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@Column(nullable = false)
	private String siteId;
	
	@NotBlank
	@Column(nullable = false)
	private String name;
	
	@Column(length = 500)
	private String url;
	
	@Column(nullable = false)
	private Integer displayOrder = 0;
	
	@Column
	private String parentId;
	
	@Column(nullable = false)
	private Boolean enabled = true;
	
	public MenuEntity() {}
	
	public MenuEntity(String siteId, String name, String url, Integer displayOrder, String parentId) {
		this.siteId = siteId;
		this.name = name;
		this.url = url;
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
	public Integer getDisplayOrder() { return displayOrder; }
	public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
	public String getParentId() { return parentId; }
	public void setParentId(String parentId) { this.parentId = parentId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

