package com.backend.common.admin.cmnCd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CmnCdCreateRequest {
	@NotBlank(message = "코드는 필수입니다.")
	@Pattern(regexp = "^[PC]\\d{3}$", message = "코드는 P001~P999 또는 C001~C999 형식이어야 합니다.")
	private String cd;
	
	@NotBlank(message = "명칭은 필수입니다.")
	private String name;
	
	private String description;
	
	private Boolean enabled = true;
	
	private String parentCd;
	
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
}

