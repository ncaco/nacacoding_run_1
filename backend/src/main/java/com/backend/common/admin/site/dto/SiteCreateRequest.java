package com.backend.common.admin.site.dto;

import com.backend.common.admin.site.model.SiteType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SiteCreateRequest {
	@NotNull
	private SiteType siteType;
	
	@NotBlank
	private String siteName;
	
	private String description;
	
	@NotBlank
	private String version;
	
	public SiteType getSiteType() { return siteType; }
	public void setSiteType(SiteType siteType) { this.siteType = siteType; }
	public String getSiteName() { return siteName; }
	public void setSiteName(String siteName) { this.siteName = siteName; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getVersion() { return version; }
	public void setVersion(String version) { this.version = version; }
}

