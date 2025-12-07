package com.backend.core.exception;

/**
 * 리소스를 찾을 수 없을 때 발생하는 예외
 */
public class ResourceNotFoundException extends RuntimeException {
	public ResourceNotFoundException(String message) {
		super(message);
	}
	
	public ResourceNotFoundException(String resourceType, String id) {
		super(String.format("%s를 찾을 수 없습니다: %s", resourceType, id));
	}
}
