package com.backend.common.admin.cmnCd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "cmn_cd", uniqueConstraints = {
	@UniqueConstraint(columnNames = "cd")
})
public class CmnCdEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	
	@NotBlank
	@Pattern(regexp = "^[PC]\\d{3}$", message = "코드는 P001~P999 또는 C001~C999 형식이어야 합니다.")
	@Column(nullable = false, unique = true, length = 4)
	private String cd;
	
	@NotBlank
	@Column(nullable = false)
	private String name;
	
	@Column(length = 1000)
	private String description;
	
	@Column(nullable = false)
	private Boolean enabled = true;
	
	@Column(length = 4)
	private String parentCd;
	
	public CmnCdEntity() {}
	
	public CmnCdEntity(String cd, String name, String description, String parentCd) {
		this.cd = cd;
		this.name = name;
		this.description = description;
		this.parentCd = parentCd;
		this.enabled = true;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
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

