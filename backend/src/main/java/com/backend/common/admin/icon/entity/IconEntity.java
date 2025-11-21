package com.backend.common.admin.icon.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "icons")
@org.hibernate.annotations.Comment("아이콘 정보를 저장하는 테이블")
public class IconEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Comment("아이콘 고유 식별자 (UUID 형식)")
	private String id;
	
	@NotBlank
	@Column(nullable = false, unique = true)
	@Comment("아이콘 ID (고유 식별자)")
	private String iconId;
	
	@NotBlank
	@Column(nullable = false)
	@Comment("아이콘명")
	private String name;
	
	@NotBlank
	@Column(nullable = false, columnDefinition = "TEXT")
	@Comment("SVG 코드")
	private String svgCode;
	
	@Column(nullable = false)
	@Comment("활성화 여부 (기본값: true)")
	private Boolean enabled = true;
	
	public IconEntity() {}
	
	public IconEntity(String iconId, String name, String svgCode) {
		this.iconId = iconId;
		this.name = name;
		this.svgCode = svgCode;
		this.enabled = true;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getIconId() { return iconId; }
	public void setIconId(String iconId) { this.iconId = iconId; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getSvgCode() { return svgCode; }
	public void setSvgCode(String svgCode) { this.svgCode = svgCode; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

