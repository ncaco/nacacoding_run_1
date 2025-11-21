package com.backend.common.admin.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SiteUpdateRequest {
	@NotBlank
	private String siteName;
	
	private String description;
	
	@NotNull
	private String contextPath;
	
	@NotBlank
	private String version;
	
	private Boolean enabled;
	
	public String getSiteName() { return siteName; }
	public void setSiteName(String siteName) { this.siteName = siteName; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getContextPath() { return contextPath; }
	public void setContextPath(String contextPath) { this.contextPath = contextPath; }
	public String getVersion() { return version; }
	public void setVersion(String version) { this.version = version; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

