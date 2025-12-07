package com.backend.core.exception;

/**
 * 중복된 리소스가 존재할 때 발생하는 예외
 */
public class DuplicateResourceException extends RuntimeException {
	public DuplicateResourceException(String message) {
		super(message);
	}
	
	public DuplicateResourceException(String resourceType, String value) {
		super(String.format("이미 존재하는 %s입니다: %s", resourceType, value));
	}
}
