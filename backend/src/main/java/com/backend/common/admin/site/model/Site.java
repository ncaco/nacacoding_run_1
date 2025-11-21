package com.backend.common.admin.site.model;

import jakarta.validation.constraints.NotBlank;

public class Site {
	private String id;
	@NotBlank
	private String siteType;
	@NotBlank
	private String siteName;
	private String description;
	@NotBlank
	private String contextPath;
	@NotBlank
	private String version;
	private Boolean enabled;
	
	public Site() {}
	
	public Site(String id, String siteType, String siteName, String description, String contextPath, String version, Boolean enabled) {
		this.id = id;
		this.siteType = siteType;
		this.siteName = siteName;
		this.description = description;
		this.contextPath = contextPath;
		this.version = version;
		this.enabled = enabled;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getSiteType() { return siteType; }
	public void setSiteType(String siteType) { this.siteType = siteType; }
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

