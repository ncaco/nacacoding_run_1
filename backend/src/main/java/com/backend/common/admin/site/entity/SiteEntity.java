package com.backend.common.admin.site.entity;

import com.backend.common.admin.site.model.SiteType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "sites")
@org.hibernate.annotations.Comment("사이트 정보를 저장하는 테이블")
public class SiteEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Comment("사이트 고유 식별자 (UUID 형식)")
	private String id;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, unique = true)
	@Comment("사이트 타입 (ADMIN: 통합관리사이트, PORTAL: 메인포털사이트)")
	private SiteType siteType;
	
	@NotBlank
	@Column(nullable = false)
	@Comment("사이트명")
	private String siteName;
	
	@Column(length = 1000)
	@Comment("사이트 설명")
	private String description;
	
	@Column(nullable = false)
	@Comment("사이트 버전")
	private String version;
	
	@Column(nullable = false)
	@Comment("활성화 여부 (기본값: true)")
	private Boolean enabled = true;
	
	public SiteEntity() {}
	
	public SiteEntity(SiteType siteType, String siteName, String description, String version) {
		this.siteType = siteType;
		this.siteName = siteName;
		this.description = description;
		this.version = version;
		this.enabled = true;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public SiteType getSiteType() { return siteType; }
	public void setSiteType(SiteType siteType) { this.siteType = siteType; }
	public String getSiteName() { return siteName; }
	public void setSiteName(String siteName) { this.siteName = siteName; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getVersion() { return version; }
	public void setVersion(String version) { this.version = version; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

