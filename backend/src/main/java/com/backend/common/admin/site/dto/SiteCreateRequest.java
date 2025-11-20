package com.backend.common.admin.site.dto;

import jakarta.validation.constraints.NotBlank;

public class SiteCreateRequest {
	@NotBlank
	private String siteType;
	
	@NotBlank
	private String siteName;
	
	private String description;
	
	@NotBlank
	private String version;
	
	public String getSiteType() { return siteType; }
	public void setSiteType(String siteType) { this.siteType = siteType; }
	public String getSiteName() { return siteName; }
	public void setSiteName(String siteName) { this.siteName = siteName; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getVersion() { return version; }
	public void setVersion(String version) { this.version = version; }
}

