package com.backend.common.admin.icon.model;

import jakarta.validation.constraints.NotBlank;

public class Icon {
	private String id;
	
	@NotBlank
	private String iconId;
	
	@NotBlank
	private String name;
	
	@NotBlank
	private String svgCode;
	
	private Boolean enabled;
	
	public Icon() {}
	
	public Icon(String id, String iconId, String name, String svgCode, Boolean enabled) {
		this.id = id;
		this.iconId = iconId;
		this.name = name;
		this.svgCode = svgCode;
		this.enabled = enabled;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getIconId() { return iconId; }
	public void setIconId(String iconId) { this.iconId = iconId; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getSvgCode() { return svgCode; }
	public void setSvgCode(String svgCode) { this.svgCode = svgCode; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

