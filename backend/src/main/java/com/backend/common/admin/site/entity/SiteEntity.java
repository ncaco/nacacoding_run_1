package com.backend.common.admin.site.entity;

import com.backend.common.admin.site.model.SiteType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "sites")
public class SiteEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, unique = true)
	private SiteType siteType;
	
	@NotBlank
	@Column(nullable = false)
	private String siteName;
	
	@Column(length = 1000)
	private String description;
	
	@Column(nullable = false)
	private String version;
	
	@Column(nullable = false)
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

