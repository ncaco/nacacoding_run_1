package com.backend.common.admin.site.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "사이트 생성 요청")
public class SiteCreateRequest {
	@Schema(description = "사이트 타입 코드 (공통코드 P001의 하위코드)", example = "C001", required = true)
	@NotBlank(message = "사이트 타입은 필수입니다")
	private String siteType;
	
	@Schema(description = "사이트명", example = "통합관리시스템", required = true)
	@NotBlank(message = "사이트명은 필수입니다")
	private String siteName;
	
	@Schema(description = "사이트 설명", example = "통합 관리 시스템")
	private String description;
	
	@Schema(description = "Context Path (URL 경로)", example = "admin", required = true)
	@NotBlank(message = "Context Path는 필수입니다")
	private String contextPath;
	
	@Schema(description = "버전", example = "1.0.0", required = true)
	@NotBlank(message = "버전은 필수입니다")
	private String version;
	
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
}

