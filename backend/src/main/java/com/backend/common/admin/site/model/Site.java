package com.backend.common.admin.site.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "사이트 정보")
public class Site {
	@Schema(description = "사이트 ID", example = "site-id-123")
	private String id;
	
	@Schema(description = "사이트 타입 코드", example = "C001")
	@NotBlank
	private String siteType;
	
	@Schema(description = "사이트명", example = "통합관리시스템")
	@NotBlank
	private String siteName;
	
	@Schema(description = "사이트 설명", example = "통합 관리 시스템")
	private String description;
	
	@Schema(description = "Context Path", example = "admin")
	@NotBlank
	private String contextPath;
	
	@Schema(description = "버전", example = "1.0.0")
	@NotBlank
	private String version;
	
	@Schema(description = "활성화 여부", example = "true")
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

