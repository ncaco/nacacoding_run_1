package com.backend.common.admin.cmnCd.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "cmn_cd", uniqueConstraints = {
	@UniqueConstraint(columnNames = {"parentCd", "cd"})
})
@org.hibernate.annotations.Comment("공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)")
public class CmnCdEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Comment("공통코드 고유 식별자 (UUID 형식)")
	private String id;
	
	@NotBlank
	@Pattern(regexp = "^[PC]\\d{3}$", message = "코드는 P001~P999 또는 C001~C999 형식이어야 합니다.")
	@Column(nullable = false, length = 4)
	@Comment("공통코드 (P001~P999: 부모코드, C001~C999: 자식코드)")
	private String cd;
	
	@NotBlank
	@Column(nullable = false)
	@Comment("공통코드명")
	private String name;
	
	@Column(length = 1000)
	@Comment("공통코드 설명")
	private String description;
	
	@Column(nullable = false)
	@Comment("활성화 여부 (기본값: true)")
	private Boolean enabled = true;
	
	@Column(length = 4)
	@Comment("부모 코드 (부모코드인 경우 NULL)")
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

