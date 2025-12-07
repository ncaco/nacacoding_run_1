package com.backend.core.constants;

/**
 * 애플리케이션 전역 상수
 */
public class Constants {
	
	// 권한 관련
	public static final String PERM_READ = "Y";
	public static final String PERM_CREATE = "Y";
	public static final String PERM_UPDATE = "Y";
	public static final String PERM_DELETE = "Y";
	public static final String PERM_DOWNLOAD = "Y";
	public static final String PERM_ALL = "Y";
	public static final String PERM_ENABLED = "Y";
	
	// 역할 코드
	public static final String ROLE_GUEST = "GUEST";
	public static final String ROLE_ADMIN = "ADMIN";
	
	// 사이트 타입 코드
	public static final String SITE_TYPE_ADMIN = "C001";
	public static final String SITE_TYPE_PORTAL = "C002";
	
	// Context Path
	public static final String CONTEXT_PATH_ADMIN = "admin";
	public static final String CONTEXT_PATH_ROOT = "";
	
	// 기본값
	public static final String DEFAULT_VERSION = "1.0.0";
	public static final int DEFAULT_DISPLAY_ORDER = 0;
	
	// 파일 관련
	public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	public static final String IMAGE_CONTENT_TYPE_PREFIX = "image/";
	
	// JWT 관련
	public static final long REFRESH_TOKEN_VALIDITY_SECONDS = 86400 * 7; // 7일
	
	private Constants() {
		// 인스턴스화 방지
	}
}
