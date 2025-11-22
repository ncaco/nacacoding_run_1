package com.backend.config;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

/**
 * 대문자 테이블명과 컬럼명을 유지하는 Physical Naming Strategy
 * 한국 데이터 표준 지침에 따라 모든 테이블명과 컬럼명을 대문자로 생성합니다.
 */
public class UppercaseNamingStrategy extends PhysicalNamingStrategyStandardImpl {
	
	@Override
	public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment context) {
		// 테이블명을 대문자로 변환하고 따옴표로 감싸서 PostgreSQL에서 대소문자 구분
		if (name == null) {
			return null;
		}
		// 이미 따옴표로 감싸진 경우(isQuoted()가 true) 그대로 유지
		// 그렇지 않은 경우 대문자로 변환하고 따옴표로 감싸기
		String tableName = name.getText().toUpperCase();
		boolean quoted = name.isQuoted() || true; // 항상 따옴표로 감싸기
		return Identifier.toIdentifier(tableName, quoted);
	}
	
	@Override
	public Identifier toPhysicalColumnName(Identifier name, JdbcEnvironment context) {
		// 컬럼명을 대문자로 변환하고 따옴표로 감싸서 PostgreSQL에서 대소문자 구분
		if (name == null) {
			return null;
		}
		String columnName = name.getText().toUpperCase();
		return Identifier.toIdentifier(columnName, true); // true = quoted (따옴표로 감싸기)
	}
	
	@Override
	public Identifier toPhysicalSequenceName(Identifier name, JdbcEnvironment context) {
		// 시퀀스명도 대문자로 변환
		if (name == null) {
			return null;
		}
		String sequenceName = name.getText().toUpperCase();
		return Identifier.toIdentifier(sequenceName, true);
	}
	
	@Override
	public Identifier toPhysicalCatalogName(Identifier name, JdbcEnvironment context) {
		// 카탈로그명도 대문자로 변환
		if (name == null) {
			return null;
		}
		String catalogName = name.getText().toUpperCase();
		return Identifier.toIdentifier(catalogName, true);
	}
	
	@Override
	public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment context) {
		// 스키마명도 대문자로 변환
		if (name == null) {
			return null;
		}
		String schemaName = name.getText().toUpperCase();
		return Identifier.toIdentifier(schemaName, true);
	}
}

