# Hibernate ddl-auto 옵션 설명

## 사용 가능한 옵션

### 1. `none` (또는 빈 값)
- **동작**: 아무것도 하지 않음
- **사용 시나리오**: 
  - 프로덕션 환경
  - Flyway, Liquibase 같은 마이그레이션 도구 사용 시
  - 수동으로 스키마 관리하는 경우
- **주의사항**: 엔티티 변경사항이 자동으로 반영되지 않음

```yaml
jpa:
  hibernate:
    ddl-auto: none
```

### 2. `validate`
- **동작**: 애플리케이션 시작 시 데이터베이스 스키마와 엔티티가 일치하는지 검증만 수행
- **사용 시나리오**: 
  - 프로덕션 환경 (스키마 변경 방지)
  - 엔티티와 DB 스키마 일치 여부 확인
- **주의사항**: 불일치 시 애플리케이션 시작 실패

```yaml
jpa:
  hibernate:
    ddl-auto: validate
```

### 3. `update` (현재 설정)
- **동작**: 
  - 기존 테이블/컬럼은 유지
  - 새로운 테이블/컬럼만 추가
  - 컬럼 삭제나 타입 변경은 제한적
- **사용 시나리오**: 
  - 개발 환경
  - 데이터 보존이 필요한 경우
- **주의사항**: 
  - 컬럼 타입 변경이 제대로 반영되지 않을 수 있음
  - 삭제된 컬럼은 자동으로 제거되지 않음
  - 코멘트 변경은 반영되지 않음

```yaml
jpa:
  hibernate:
    ddl-auto: update
```

### 4. `create`
- **동작**: 
  - 애플리케이션 시작 시 모든 테이블을 삭제하고 새로 생성
  - 종료 시에는 삭제하지 않음
- **사용 시나리오**: 
  - 개발/테스트 환경
  - 초기 개발 단계
- **주의사항**: **모든 데이터가 삭제됨!**

```yaml
jpa:
  hibernate:
    ddl-auto: create
```

### 5. `create-drop`
- **동작**: 
  - 애플리케이션 시작 시 모든 테이블 생성
  - 종료 시 모든 테이블 삭제
- **사용 시나리오**: 
  - 테스트 환경
  - 임시 개발 환경
- **주의사항**: **모든 데이터가 삭제됨!**

```yaml
jpa:
  hibernate:
    ddl-auto: create-drop
```

## 권장 설정

### 개발 환경
```yaml
jpa:
  hibernate:
    ddl-auto: update  # 또는 create (초기 개발 시)
```

### 프로덕션 환경
```yaml
jpa:
  hibernate:
    ddl-auto: validate  # 또는 none
```

### 프로파일별 설정 예시

**application-dev.yml** (개발)
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

**application-prod.yml** (프로덕션)
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

## 마이그레이션 도구와 함께 사용

프로덕션 환경에서는 `ddl-auto: none` 또는 `validate`를 사용하고, 
Flyway나 Liquibase 같은 마이그레이션 도구를 사용하는 것이 권장됩니다.

```yaml
# Flyway 사용 예시
spring:
  jpa:
    hibernate:
      ddl-auto: none
  flyway:
    enabled: true
    locations: classpath:db/migration
```

## 현재 프로젝트 권장사항

현재는 개발 단계이므로 `update`가 적합하지만, 
프로덕션 배포 전에는 다음 중 하나를 고려하세요:

1. **`validate`로 변경**: 스키마 변경을 방지하고 안정성 확보
2. **마이그레이션 도구 도입**: Flyway 또는 Liquibase로 스키마 버전 관리

