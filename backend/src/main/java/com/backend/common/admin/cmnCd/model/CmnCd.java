package com.backend.common.admin.cmnCd.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public class CmnCd {
	private String id;
	
	@NotBlank
	@Pattern(regexp = "^[PC]\\d{3}$", message = "코드는 P001~P999 또는 C001~C999 형식이어야 합니다.")
	private String cd;
	
	@NotBlank
	private String name;
	
	private String description;
	
	private Boolean enabled;
	
	private String parentCd;
	
	private List<CmnCd> children;
	
	public CmnCd() {}
	
	public CmnCd(String id, String cd, String name, String description, Boolean enabled, String parentCd) {
		this.id = id;
		this.cd = cd;
		this.name = name;
		this.description = description;
		this.enabled = enabled;
		this.parentCd = parentCd;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getCd() { return cd; }
	public void setCd(String cd) { this.cd = cd; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
	public String getParentCd() { return parentCd; }
	public void setParentCd(String parentCd) { this.parentCd = parentCd; }
	public List<CmnCd> getChildren() { return children; }
	public void setChildren(List<CmnCd> children) { this.children = children; }
}

