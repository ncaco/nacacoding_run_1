# 데이터베이스 구조

## 데이터베이스 정보

- **타입**: H2 Database (인메모리)
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **사용자명**: `sa`
- **비밀번호**: (없음)
- **DDL 모드**: `update` (자동 스키마 생성)

## 테이블 구조

### users 테이블

사용자 및 관리자 정보를 저장하는 테이블입니다.

#### 스키마

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 고유 식별자 (UUID 형식) |
| `username` | VARCHAR(255) | NOT NULL, UNIQUE | 사용자명 (로그인 ID) |
| `password` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 (BCrypt 해시) |
| `role` | VARCHAR(255) | NOT NULL | 사용자 역할 (USER: 관리자, MEMBER: 사용자) |

#### 인덱스

- `username` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 역할 (Role) Enum

```java
public enum Role {
    USER,    // 관리자
    MEMBER   // 사용자
}
```

#### 초기 데이터

애플리케이션 시작 시 다음 계정이 자동으로 생성됩니다:

1. **관리자 계정**
   - username: `admin`
   - password: `admin123` (BCrypt 해시됨)
   - role: `USER`

2. **사용자 계정**
   - username: `member`
   - password: `member123` (BCrypt 해시됨)
   - role: `MEMBER`

## 엔티티 매핑

### UserEntity

```java
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
```

### sites 테이블

사이트 정보를 저장하는 테이블입니다.

#### 스키마

```sql
CREATE TABLE sites (
    id VARCHAR(255) PRIMARY KEY,
    site_type VARCHAR(255) NOT NULL UNIQUE,
    site_name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    version VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL
);
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 사이트 고유 식별자 (UUID 형식) |
| `site_type` | VARCHAR(255) | NOT NULL, UNIQUE | 사이트 타입 (ADMIN: 통합관리사이트, PORTAL: 메인포털사이트) |
| `site_name` | VARCHAR(255) | NOT NULL | 사이트명 |
| `description` | VARCHAR(1000) | NULL | 사이트 설명 |
| `version` | VARCHAR(255) | NOT NULL | 사이트 버전 |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `site_type` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 사이트 타입 (SiteType) Enum

```java
public enum SiteType {
    ADMIN,    // 통합관리사이트
    PORTAL    // 메인포털사이트
}
```

### menus 테이블

메뉴 정보를 저장하는 테이블입니다. 사이트에 속하며 계층 구조를 지원합니다.

#### 스키마

```sql
CREATE TABLE menus (
    id VARCHAR(255) PRIMARY KEY,
    site_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    display_order INTEGER NOT NULL,
    parent_id VARCHAR(255),
    enabled BOOLEAN NOT NULL
);
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 메뉴 고유 식별자 (UUID 형식) |
| `site_id` | VARCHAR(255) | NOT NULL | 사이트 ID (sites 테이블 참조) |
| `name` | VARCHAR(255) | NOT NULL | 메뉴명 |
| `url` | VARCHAR(500) | NULL | 메뉴 URL |
| `display_order` | INTEGER | NOT NULL | 표시 순서 (기본값: 0) |
| `parent_id` | VARCHAR(255) | NULL | 부모 메뉴 ID (NULL이면 최상위 메뉴) |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `site_id` 컬럼에 인덱스가 생성되어 사이트별 메뉴 조회 성능이 향상됩니다.
- `parent_id` 컬럼에 인덱스가 생성되어 계층 구조 조회 성능이 향상됩니다.

## 관계 및 제약조건

- 현재 프로젝트는 `users`, `sites`, `menus` 테이블을 사용합니다.
- `Member`는 별도의 테이블이 아닌 `users` 테이블에서 `role = 'MEMBER'`인 레코드를 조회하여 사용합니다.
- `User`는 `users` 테이블에서 `role = 'USER'`인 레코드를 조회하여 사용합니다.
- `sites` 테이블은 사이트 정보를 관리하며, `site_type`은 UNIQUE 제약조건이 있어 동일한 타입의 사이트는 하나만 존재할 수 있습니다.
- `menus` 테이블은 메뉴 정보를 관리하며, `site_id`를 통해 사이트에 속합니다.
- `menus` 테이블은 `parent_id`를 통해 계층 구조를 지원합니다 (부모-하위 메뉴 관계).

## 데이터 접근 패턴

### UserRepository

```java
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
```

### SiteEntity

```java
@Entity
@Table(name = "sites")
public class SiteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private SiteType siteType;
    
    @Column(nullable = false)
    private String siteName;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private String version;
    
    @Column(nullable = false)
    private Boolean enabled;
}
```

### SiteRepository

```java
public interface SiteRepository extends JpaRepository<SiteEntity, String> {
    Optional<SiteEntity> findBySiteType(SiteType siteType);
    boolean existsBySiteType(SiteType siteType);
}
```

### MenuEntity

```java
@Entity
@Table(name = "menus")
public class MenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String siteId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 500)
    private String url;
    
    @Column(nullable = false)
    private Integer displayOrder;
    
    @Column
    private String parentId;
    
    @Column(nullable = false)
    private Boolean enabled;
}
```

### MenuRepository

```java
public interface MenuRepository extends JpaRepository<MenuEntity, String> {
    List<MenuEntity> findBySiteId(String siteId);
    List<MenuEntity> findBySiteIdAndEnabledTrue(String siteId);
    List<MenuEntity> findBySiteIdAndParentIdIsNull(String siteId);
    List<MenuEntity> findByParentId(String parentId);
    boolean existsBySiteId(String siteId);
}
```

### 주요 쿼리

1. **사용자명으로 조회**
   ```java
   userRepository.findByUsername(username)
   ```

2. **사용자명 존재 여부 확인**
   ```java
   userRepository.existsByUsername(username)
   ```

3. **역할별 필터링**
   - 관리자 목록: `role = 'USER'`
   - 멤버 목록: `role = 'MEMBER'`

### SiteRepository 주요 쿼리

1. **사이트 타입으로 조회**
   ```java
   siteRepository.findBySiteType(siteType)
   ```

2. **사이트 타입 존재 여부 확인**
   ```java
   siteRepository.existsBySiteType(siteType)
   ```

### MenuRepository 주요 쿼리

1. **사이트별 메뉴 조회**
   ```java
   menuRepository.findBySiteId(siteId)
   ```

2. **사이트별 활성화된 메뉴 조회**
   ```java
   menuRepository.findBySiteIdAndEnabledTrue(siteId)
   ```

3. **최상위 메뉴 조회 (부모가 없는 메뉴)**
   ```java
   menuRepository.findBySiteIdAndParentIdIsNull(siteId)
   ```

4. **하위 메뉴 조회**
   ```java
   menuRepository.findByParentId(parentId)
   ```

## 보안 고려사항

- 비밀번호는 BCrypt 알고리즘으로 해시되어 저장됩니다.
- 평문 비밀번호는 절대 저장되지 않습니다.
- JWT 토큰에 역할 정보가 포함되어 권한 검증에 사용됩니다.

## 데이터베이스 접근

### H2 콘솔

- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- 사용자명: `sa`
- 비밀번호: (비워두기)

### 주의사항

- 현재 설정은 인메모리 데이터베이스를 사용하므로 애플리케이션 재시작 시 모든 데이터가 초기화됩니다.
- 프로덕션 환경에서는 파일 기반 H2 또는 다른 데이터베이스(PostgreSQL, MySQL 등)로 변경해야 합니다.

