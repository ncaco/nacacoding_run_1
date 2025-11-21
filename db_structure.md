# 데이터베이스 구조

## 데이터베이스 정보

- **타입**: PostgreSQL
- **호스트**: `localhost`
- **포트**: `5432`
- **JDBC URL**: `jdbc:postgresql://localhost:5432/postgres`
- **데이터베이스명**: `postgres`
- **사용자명**: `postgres`
- **비밀번호**: `qwe123!@#`
- **DDL 모드**: `update` (자동 스키마 생성)

## 테이블 구조

### users 테이블

**테이블 코멘트**: 사용자 및 관리자 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    avatar_url VARCHAR(255)
);

COMMENT ON TABLE users IS '사용자 및 관리자 정보를 저장하는 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN users.username IS '사용자명 (로그인 ID)';
COMMENT ON COLUMN users.password IS '암호화된 비밀번호 (BCrypt 해시)';
COMMENT ON COLUMN users.role IS '사용자 역할 (USER: 관리자, MEMBER: 사용자)';
COMMENT ON COLUMN users.name IS '사용자 이름';
COMMENT ON COLUMN users.email IS '이메일 주소';
COMMENT ON COLUMN users.avatar_url IS '아바타 이미지 URL';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 고유 식별자 (UUID 형식) |
| `username` | VARCHAR(255) | NOT NULL, UNIQUE | 사용자명 (로그인 ID) |
| `password` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 (BCrypt 해시) |
| `role` | VARCHAR(255) | NOT NULL | 사용자 역할 (USER: 관리자, MEMBER: 사용자) |
| `name` | VARCHAR(255) | NULL | 사용자 이름 |
| `email` | VARCHAR(255) | NULL | 이메일 주소 |
| `avatar_url` | VARCHAR(255) | NULL | 아바타 이미지 URL |

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

### sites 테이블

**테이블 코멘트**: 사이트 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE sites (
    id VARCHAR(255) PRIMARY KEY,
    site_type VARCHAR(255) NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    context_path VARCHAR(255) NOT NULL UNIQUE,
    version VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL
);

COMMENT ON TABLE sites IS '사이트 정보를 저장하는 테이블';
COMMENT ON COLUMN sites.id IS '사이트 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN sites.site_type IS '사이트 타입 (공통코드 P001의 하위코드 사용)';
COMMENT ON COLUMN sites.site_name IS '사이트명';
COMMENT ON COLUMN sites.description IS '사이트 설명';
COMMENT ON COLUMN sites.context_path IS 'Context Path (빈 값 = root, 예: ''admin'' = /admin)';
COMMENT ON COLUMN sites.version IS '사이트 버전';
COMMENT ON COLUMN sites.enabled IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 사이트 고유 식별자 (UUID 형식) |
| `site_type` | VARCHAR(255) | NOT NULL | 사이트 타입 (공통코드 P001의 하위코드 사용) |
| `site_name` | VARCHAR(255) | NOT NULL | 사이트명 |
| `description` | VARCHAR(1000) | NULL | 사이트 설명 |
| `context_path` | VARCHAR(255) | NOT NULL, UNIQUE | Context Path (빈 값 = root, 예: 'admin' = /admin) |
| `version` | VARCHAR(255) | NOT NULL | 사이트 버전 |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `context_path` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 사이트 타입 (SiteType) Enum

```java
public enum SiteType {
    ADMIN,    // 통합관리사이트
    PORTAL    // 메인포털사이트
}
```

### menus 테이블

**테이블 코멘트**: 메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)

#### 스키마

```sql
CREATE TABLE menus (
    id VARCHAR(255) PRIMARY KEY,
    site_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    icon VARCHAR(100),
    display_order INTEGER NOT NULL,
    parent_id VARCHAR(255),
    enabled BOOLEAN NOT NULL
);

COMMENT ON TABLE menus IS '메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)';
COMMENT ON COLUMN menus.id IS '메뉴 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN menus.site_id IS '사이트 ID (sites 테이블 참조)';
COMMENT ON COLUMN menus.name IS '메뉴명';
COMMENT ON COLUMN menus.url IS '메뉴 URL';
COMMENT ON COLUMN menus.icon IS '메뉴 아이콘 ID (icons 테이블의 icon_id 참조)';
COMMENT ON COLUMN menus.display_order IS '표시 순서';
COMMENT ON COLUMN menus.parent_id IS '부모 메뉴 ID (계층 구조용, 최상위 메뉴는 NULL)';
COMMENT ON COLUMN menus.enabled IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 메뉴 고유 식별자 (UUID 형식) |
| `site_id` | VARCHAR(255) | NOT NULL | 사이트 ID (sites 테이블 참조) |
| `name` | VARCHAR(255) | NOT NULL | 메뉴명 |
| `url` | VARCHAR(500) | NULL | 메뉴 URL |
| `icon` | VARCHAR(100) | NULL | 메뉴 아이콘 ID (icons 테이블의 icon_id 참조) |
| `display_order` | INTEGER | NOT NULL | 표시 순서 (기본값: 0) |
| `parent_id` | VARCHAR(255) | NULL | 부모 메뉴 ID (NULL이면 최상위 메뉴) |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `site_id` 컬럼에 인덱스가 생성되어 사이트별 메뉴 조회 성능이 향상됩니다.
- `parent_id` 컬럼에 인덱스가 생성되어 계층 구조 조회 성능이 향상됩니다.

### icons 테이블

**테이블 코멘트**: 아이콘 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE icons (
    id VARCHAR(255) PRIMARY KEY,
    icon_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    svg_code TEXT NOT NULL,
    enabled BOOLEAN NOT NULL
);

COMMENT ON TABLE icons IS '아이콘 정보를 저장하는 테이블';
COMMENT ON COLUMN icons.id IS '아이콘 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN icons.icon_id IS '아이콘 ID (고유 식별자)';
COMMENT ON COLUMN icons.name IS '아이콘명';
COMMENT ON COLUMN icons.svg_code IS 'SVG 코드';
COMMENT ON COLUMN icons.enabled IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 아이콘 고유 식별자 (UUID 형식) |
| `icon_id` | VARCHAR(255) | NOT NULL, UNIQUE | 아이콘 ID (고유 식별자) |
| `name` | VARCHAR(255) | NOT NULL | 아이콘명 |
| `svg_code` | TEXT | NOT NULL | SVG 코드 |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `icon_id` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

### cmn_cd 테이블

**테이블 코멘트**: 공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)

#### 스키마

```sql
CREATE TABLE cmn_cd (
    id VARCHAR(255) PRIMARY KEY,
    cd VARCHAR(4) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    enabled BOOLEAN NOT NULL,
    parent_cd VARCHAR(4),
    UNIQUE(parent_cd, cd)
);

COMMENT ON TABLE cmn_cd IS '공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)';
COMMENT ON COLUMN cmn_cd.id IS '공통코드 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN cmn_cd.cd IS '공통코드 (P001~P999: 부모코드, C001~C999: 자식코드)';
COMMENT ON COLUMN cmn_cd.name IS '공통코드명';
COMMENT ON COLUMN cmn_cd.description IS '공통코드 설명';
COMMENT ON COLUMN cmn_cd.enabled IS '활성화 여부 (기본값: true)';
COMMENT ON COLUMN cmn_cd.parent_cd IS '부모 코드 (부모코드인 경우 NULL)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | VARCHAR(255) | PRIMARY KEY, UUID | 공통코드 고유 식별자 (UUID 형식) |
| `cd` | VARCHAR(4) | NOT NULL | 공통코드 (P001~P999: 부모코드, C001~C999: 자식코드) |
| `name` | VARCHAR(255) | NOT NULL | 공통코드명 |
| `description` | VARCHAR(1000) | NULL | 공통코드 설명 |
| `enabled` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |
| `parent_cd` | VARCHAR(4) | NULL | 부모 코드 (부모코드인 경우 NULL) |

#### 제약조건

- `(parent_cd, cd)` 조합에 UNIQUE 제약조건이 있어 동일한 부모 코드 하위에 중복된 코드가 생성되지 않습니다.
- 코드 형식: `P001~P999` (부모코드), `C001~C999` (자식코드)

## 엔티티 매핑

### UserEntity

```java
@Entity
@Table(name = "users")
@org.hibernate.annotations.Comment("사용자 및 관리자 정보를 저장하는 테이블")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Comment("사용자 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(unique = true, nullable = false)
    @Comment("사용자명 (로그인 ID)")
    private String username;
    
    @Column(nullable = false)
    @Comment("암호화된 비밀번호 (BCrypt 해시)")
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Comment("사용자 역할 (USER: 관리자, MEMBER: 사용자)")
    private Role role;
    
    @Column
    @Comment("사용자 이름")
    private String name;
    
    @Column
    @Comment("이메일 주소")
    private String email;
    
    @Column
    @Comment("아바타 이미지 URL")
    private String avatarUrl;
}
```

### SiteEntity

```java
@Entity
@Table(name = "sites")
@org.hibernate.annotations.Comment("사이트 정보를 저장하는 테이블")
public class SiteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Comment("사이트 고유 식별자 (UUID 형식)")
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    @Comment("사이트 타입 (ADMIN: 통합관리사이트, PORTAL: 메인포털사이트)")
    private SiteType siteType;
    
    @Column(nullable = false)
    @Comment("사이트명")
    private String siteName;
    
    @Column(length = 1000)
    @Comment("사이트 설명")
    private String description;
    
    @Column(nullable = false)
    @Comment("사이트 버전")
    private String version;
    
    @Column(nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### MenuEntity

```java
@Entity
@Table(name = "menus")
@org.hibernate.annotations.Comment("메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)")
public class MenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Comment("메뉴 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(nullable = false)
    @Comment("사이트 ID (sites 테이블 참조)")
    private String siteId;
    
    @Column(nullable = false)
    @Comment("메뉴명")
    private String name;
    
    @Column(length = 500)
    @Comment("메뉴 URL")
    private String url;
    
    @Column(nullable = false)
    @Comment("표시 순서")
    private Integer displayOrder = 0;
    
    @Column
    @Comment("부모 메뉴 ID (계층 구조용, 최상위 메뉴는 NULL)")
    private String parentId;
    
    @Column(nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### CmnCdEntity

```java
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
    
    @Column(nullable = false, length = 4)
    @Comment("공통코드 (P001~P999: 부모코드, C001~C999: 자식코드)")
    private String cd;
    
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
}
```

## Repository 인터페이스

### UserRepository

```java
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
```

### SiteRepository

```java
public interface SiteRepository extends JpaRepository<SiteEntity, String> {
    Optional<SiteEntity> findBySiteType(SiteType siteType);
    boolean existsBySiteType(SiteType siteType);
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

### CmnCdRepository

```java
public interface CmnCdRepository extends JpaRepository<CmnCdEntity, String> {
    Optional<CmnCdEntity> findByCd(String cd);
    List<CmnCdEntity> findByParentCdIsNull();
    List<CmnCdEntity> findByParentCd(String parentCd);
    boolean existsByCd(String cd);
    boolean existsByParentCdAndCd(String parentCd, String cd);
    boolean existsByParentCdIsNullAndCd(String cd);
    List<CmnCdEntity> findAllByOrderByCdAsc();
}
```

## 주요 쿼리

### UserRepository 주요 쿼리

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

### CmnCdRepository 주요 쿼리

1. **코드로 조회**
   ```java
   cmnCdRepository.findByCd(cd)
   ```

2. **부모 코드 조회 (최상위 코드)**
   ```java
   cmnCdRepository.findByParentCdIsNull()
   ```

3. **자식 코드 조회**
   ```java
   cmnCdRepository.findByParentCd(parentCd)
   ```

4. **코드 존재 여부 확인**
   ```java
   cmnCdRepository.existsByCd(cd)
   ```

5. **부모 코드와 코드 조합 존재 여부 확인**
   ```java
   cmnCdRepository.existsByParentCdAndCd(parentCd, cd)
   ```

6. **부모 코드가 NULL인 코드 존재 여부 확인**
   ```java
   cmnCdRepository.existsByParentCdIsNullAndCd(cd)
   ```

7. **코드 순서대로 전체 조회**
   ```java
   cmnCdRepository.findAllByOrderByCdAsc()
   ```

## 관계 및 제약조건

- 현재 프로젝트는 `users`, `sites`, `menus`, `cmn_cd` 테이블을 사용합니다.
- `Member`는 별도의 테이블이 아닌 `users` 테이블에서 `role = 'MEMBER'`인 레코드를 조회하여 사용합니다.
- `User`는 `users` 테이블에서 `role = 'USER'`인 레코드를 조회하여 사용합니다.
- `sites` 테이블은 사이트 정보를 관리하며, `site_type`은 UNIQUE 제약조건이 있어 동일한 타입의 사이트는 하나만 존재할 수 있습니다.
- `menus` 테이블은 메뉴 정보를 관리하며, `site_id`를 통해 사이트에 속합니다.
- `menus` 테이블은 `parent_id`를 통해 계층 구조를 지원합니다 (부모-하위 메뉴 관계).
- `cmn_cd` 테이블은 공통코드를 관리하며, `parent_cd`를 통해 계층 구조를 지원합니다.
- `cmn_cd` 테이블은 `(parent_cd, cd)` 조합에 UNIQUE 제약조건이 있습니다.

## 보안 고려사항

- 비밀번호는 BCrypt 알고리즘으로 해시되어 저장됩니다.
- 평문 비밀번호는 절대 저장되지 않습니다.
- JWT 토큰에 역할 정보가 포함되어 권한 검증에 사용됩니다.

## 데이터베이스 접근

### PostgreSQL 접속 정보

- **호스트**: `localhost`
- **포트**: `5432`
- **데이터베이스**: `postgres`
- **사용자명**: `postgres`
- **비밀번호**: `qwe123!@#`

### 테이블 및 컬럼 코멘트 확인

PostgreSQL에서 테이블과 컬럼 코멘트를 확인하려면 다음 쿼리를 사용하세요:

```sql
-- 테이블 코멘트 확인
SELECT 
    schemaname,
    tablename,
    obj_description(pgc.oid, 'pg_class') AS table_comment
FROM pg_tables pt
JOIN pg_class pgc ON pgc.relname = pt.tablename
WHERE schemaname = 'public'
ORDER BY tablename;

-- 컬럼 코멘트 확인
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    col_description(pgc.oid, ordinal_position) AS column_comment
FROM information_schema.columns
JOIN pg_class pgc ON pgc.relname = table_name
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### 주의사항

- PostgreSQL은 영구 저장 데이터베이스이므로 애플리케이션 재시작 시에도 데이터가 유지됩니다.
- `ddl-auto: update` 설정으로 엔티티 변경 시 자동으로 스키마가 업데이트됩니다.
- 프로덕션 환경에서는 `ddl-auto`를 `validate` 또는 `none`으로 변경하는 것을 권장합니다.
- 모든 테이블과 컬럼에는 코멘트가 자동으로 생성되어 데이터베이스 문서화가 향상됩니다.
