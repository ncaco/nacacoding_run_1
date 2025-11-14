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

## 관계 및 제약조건

- 현재 프로젝트는 단일 테이블(`users`) 구조를 사용합니다.
- `Member`는 별도의 테이블이 아닌 `users` 테이블에서 `role = 'MEMBER'`인 레코드를 조회하여 사용합니다.
- `User`는 `users` 테이블에서 `role = 'USER'`인 레코드를 조회하여 사용합니다.

## 데이터 접근 패턴

### UserRepository

```java
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);
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

