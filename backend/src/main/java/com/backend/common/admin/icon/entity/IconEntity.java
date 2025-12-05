package com.backend.common.admin.icon.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ICONS")
@org.hibernate.annotations.Comment("아이콘 정보를 저장하는 테이블")
public class IconEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ICON_ID")
    @org.hibernate.annotations.Comment("아이콘 고유 식별자 (UUID 형식)")
    private String id;
    
    @NotBlank
    @Column(name = "ICON_CD", nullable = false, unique = true)
    @org.hibernate.annotations.Comment("아이콘 코드 (고유 식별자)")
    private String iconId;
    
    @NotBlank
    @Column(name = "ICON_NM", nullable = false)
    @org.hibernate.annotations.Comment("아이콘명")
    private String name;
    
    @NotBlank
    @Column(name = "SVG_CODE", nullable = false, columnDefinition = "text")
    @org.hibernate.annotations.Comment("SVG 코드")
    private String svgCode;
    
    @Column(name = "USE_YN", nullable = false)
    @org.hibernate.annotations.Comment("활성화 여부 (기본값: true)")
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

