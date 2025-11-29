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

### USERS 테이블

**테이블 코멘트**: 사용자 및 관리자 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE USERS (
    USER_ID VARCHAR(255) PRIMARY KEY,
    USER_NM VARCHAR(255) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    ROLE VARCHAR(255) NOT NULL,
    NAME VARCHAR(255),
    EMAIL VARCHAR(255),
    AVATAR_URL VARCHAR(255)
);

COMMENT ON TABLE USERS IS '사용자 및 관리자 정보를 저장하는 테이블';
COMMENT ON COLUMN USERS.USER_ID IS '사용자 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN USERS.USER_NM IS '사용자명 (로그인 ID)';
COMMENT ON COLUMN USERS.PASSWORD IS '암호화된 비밀번호 (BCrypt 해시)';
COMMENT ON COLUMN USERS.ROLE IS '사용자 역할 (USER: 관리자, MEMBER: 사용자)';
COMMENT ON COLUMN USERS.NAME IS '사용자 이름';
COMMENT ON COLUMN USERS.EMAIL IS '이메일 주소';
COMMENT ON COLUMN USERS.AVATAR_URL IS '아바타 이미지 URL';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `USER_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 고유 식별자 (UUID 형식) |
| `USER_NM` | VARCHAR(255) | NOT NULL, UNIQUE | 사용자명 (로그인 ID) |
| `PASSWORD` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 (BCrypt 해시) |
| `ROLE` | VARCHAR(255) | NOT NULL | 사용자 역할 (USER: 관리자, MEMBER: 사용자) |
| `NAME` | VARCHAR(255) | NULL | 사용자 이름 |
| `EMAIL` | VARCHAR(255) | NULL | 이메일 주소 |
| `AVATAR_URL` | VARCHAR(255) | NULL | 아바타 이미지 URL |

#### 인덱스

- `USER_NM` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

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

### MEMBERS 테이블

**테이블 코멘트**: 사용자(MEMBER) 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE MEMBERS (
    MEMBER_ID VARCHAR(255) PRIMARY KEY,
    USER_NM VARCHAR(255) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    NAME VARCHAR(255),
    EMAIL VARCHAR(255),
    AVATAR_URL VARCHAR(255)
);

COMMENT ON TABLE MEMBERS IS '사용자(MEMBER) 정보를 저장하는 테이블';
COMMENT ON COLUMN MEMBERS.MEMBER_ID IS '사용자(MEMBER) 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN MEMBERS.USER_NM IS '사용자명 (로그인 ID)';
COMMENT ON COLUMN MEMBERS.PASSWORD IS '암호화된 비밀번호 (BCrypt 해시)';
COMMENT ON COLUMN MEMBERS.NAME IS '사용자 이름';
COMMENT ON COLUMN MEMBERS.EMAIL IS '이메일 주소';
COMMENT ON COLUMN MEMBERS.AVATAR_URL IS '아바타 이미지 URL';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `MEMBER_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자(MEMBER) 고유 식별자 (UUID 형식) |
| `USER_NM` | VARCHAR(255) | NOT NULL, UNIQUE | 사용자명 (로그인 ID) |
| `PASSWORD` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 (BCrypt 해시) |
| `NAME` | VARCHAR(255) | NULL | 사용자 이름 |
| `EMAIL` | VARCHAR(255) | NULL | 이메일 주소 |
| `AVATAR_URL` | VARCHAR(255) | NULL | 아바타 이미지 URL |

### SITES 테이블

**테이블 코멘트**: 사이트 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE SITES (
    SITE_ID VARCHAR(255) PRIMARY KEY,
    SITE_TYPE_CD VARCHAR(255) NOT NULL,
    SITE_NM VARCHAR(255) NOT NULL,
    SITE_DESC VARCHAR(1000),
    CONTEXT_PATH VARCHAR(255) NOT NULL UNIQUE,
    VERSION VARCHAR(255) NOT NULL,
    USE_YN BOOLEAN NOT NULL
);

COMMENT ON TABLE SITES IS '사이트 정보를 저장하는 테이블';
COMMENT ON COLUMN SITES.SITE_ID IS '사이트 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN SITES.SITE_TYPE_CD IS '사이트 타입 (공통코드 P001의 하위코드 사용)';
COMMENT ON COLUMN SITES.SITE_NM IS '사이트명';
COMMENT ON COLUMN SITES.SITE_DESC IS '사이트 설명';
COMMENT ON COLUMN SITES.CONTEXT_PATH IS 'Context Path (빈 값 = root, 예: ''admin'' = /admin)';
COMMENT ON COLUMN SITES.VERSION IS '사이트 버전';
COMMENT ON COLUMN SITES.USE_YN IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `SITE_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사이트 고유 식별자 (UUID 형식) |
| `SITE_TYPE_CD` | VARCHAR(255) | NOT NULL | 사이트 타입 (공통코드 P001의 하위코드 사용) |
| `SITE_NM` | VARCHAR(255) | NOT NULL | 사이트명 |
| `SITE_DESC` | VARCHAR(1000) | NULL | 사이트 설명 |
| `CONTEXT_PATH` | VARCHAR(255) | NOT NULL, UNIQUE | Context Path (빈 값 = root, 예: 'admin' = /admin) |
| `VERSION` | VARCHAR(255) | NOT NULL | 사이트 버전 |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `CONTEXT_PATH` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 사이트 타입 (SiteType) Enum

```java
public enum SiteType {
    ADMIN,    // 통합관리사이트
    PORTAL    // 메인포털사이트
}
```

### MENUS 테이블

**테이블 코멘트**: 메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)

#### 스키마

```sql
CREATE TABLE MENUS (
    MENU_ID VARCHAR(255) PRIMARY KEY,
    SITE_ID VARCHAR(255) NOT NULL,
    MENU_NM VARCHAR(255) NOT NULL,
    MENU_URL VARCHAR(500),
    ICON_ID VARCHAR(100),
    DISP_ORD INTEGER NOT NULL,
    PARENT_ID VARCHAR(255),
    USE_YN BOOLEAN NOT NULL
);

COMMENT ON TABLE MENUS IS '메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)';
COMMENT ON COLUMN MENUS.MENU_ID IS '메뉴 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN MENUS.SITE_ID IS '사이트 ID (SITES 테이블 참조)';
COMMENT ON COLUMN MENUS.MENU_NM IS '메뉴명';
COMMENT ON COLUMN MENUS.MENU_URL IS '메뉴 URL';
COMMENT ON COLUMN MENUS.ICON_ID IS '메뉴 아이콘 ID (ICONS 테이블의 ICON_CD 참조)';
COMMENT ON COLUMN MENUS.DISP_ORD IS '표시 순서';
COMMENT ON COLUMN MENUS.PARENT_ID IS '부모 메뉴 ID (계층 구조용, 최상위 메뉴는 NULL)';
COMMENT ON COLUMN MENUS.USE_YN IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `MENU_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 메뉴 고유 식별자 (UUID 형식) |
| `SITE_ID` | VARCHAR(255) | NOT NULL | 사이트 ID (SITES 테이블 참조) |
| `MENU_NM` | VARCHAR(255) | NOT NULL | 메뉴명 |
| `MENU_URL` | VARCHAR(500) | NULL | 메뉴 URL |
| `ICON_ID` | VARCHAR(100) | NULL | 메뉴 아이콘 ID (ICONS 테이블의 ICON_CD 참조) |
| `DISP_ORD` | INTEGER | NOT NULL | 표시 순서 (기본값: 0) |
| `PARENT_ID` | VARCHAR(255) | NULL | 부모 메뉴 ID (NULL이면 최상위 메뉴) |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `SITE_ID` 컬럼에 인덱스가 생성되어 사이트별 메뉴 조회 성능이 향상됩니다.
- `PARENT_ID` 컬럼에 인덱스가 생성되어 계층 구조 조회 성능이 향상됩니다.

### ICONS 테이블

**테이블 코멘트**: 아이콘 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE ICONS (
    ICON_ID VARCHAR(255) PRIMARY KEY,
    ICON_CD VARCHAR(255) NOT NULL UNIQUE,
    ICON_NM VARCHAR(255) NOT NULL,
    SVG_CODE TEXT NOT NULL,
    USE_YN BOOLEAN NOT NULL
);

COMMENT ON TABLE ICONS IS '아이콘 정보를 저장하는 테이블';
COMMENT ON COLUMN ICONS.ICON_ID IS '아이콘 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN ICONS.ICON_CD IS '아이콘 코드 (고유 식별자)';
COMMENT ON COLUMN ICONS.ICON_NM IS '아이콘명';
COMMENT ON COLUMN ICONS.SVG_CODE IS 'SVG 코드';
COMMENT ON COLUMN ICONS.USE_YN IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `ICON_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 아이콘 고유 식별자 (UUID 형식) |
| `ICON_CD` | VARCHAR(255) | NOT NULL, UNIQUE | 아이콘 코드 (고유 식별자) |
| `ICON_NM` | VARCHAR(255) | NOT NULL | 아이콘명 |
| `SVG_CODE` | TEXT | NOT NULL | SVG 코드 |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `ICON_CD` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

### CMN_CD 테이블

**테이블 코멘트**: 공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)

#### 스키마

```sql
CREATE TABLE CMN_CD (
    CMN_CD_ID VARCHAR(255) PRIMARY KEY,
    CD VARCHAR(4) NOT NULL,
    CD_NM VARCHAR(255) NOT NULL,
    CD_DESC VARCHAR(1000),
    USE_YN BOOLEAN NOT NULL,
    PARENT_CD VARCHAR(4),
    UNIQUE(PARENT_CD, CD)
);

COMMENT ON TABLE CMN_CD IS '공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)';
COMMENT ON COLUMN CMN_CD.CMN_CD_ID IS '공통코드 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN CMN_CD.CD IS '공통코드 (P001~P999: 부모코드, C001~C999: 자식코드)';
COMMENT ON COLUMN CMN_CD.CD_NM IS '공통코드명';
COMMENT ON COLUMN CMN_CD.CD_DESC IS '공통코드 설명';
COMMENT ON COLUMN CMN_CD.USE_YN IS '활성화 여부 (기본값: true)';
COMMENT ON COLUMN CMN_CD.PARENT_CD IS '부모 코드 (부모코드인 경우 NULL)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `CMN_CD_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 공통코드 고유 식별자 (UUID 형식) |
| `CD` | VARCHAR(4) | NOT NULL | 공통코드 (P001~P999: 부모코드, C001~C999: 자식코드) |
| `CD_NM` | VARCHAR(255) | NOT NULL | 공통코드명 |
| `CD_DESC` | VARCHAR(1000) | NULL | 공통코드 설명 |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |
| `PARENT_CD` | VARCHAR(4) | NULL | 부모 코드 (부모코드인 경우 NULL) |

#### 제약조건

- `(PARENT_CD, CD)` 조합에 UNIQUE 제약조건이 있어 동일한 부모 코드 하위에 중복된 코드가 생성되지 않습니다.
- 코드 형식: `P001~P999` (부모코드), `C001~C999` (자식코드)

### USER_ROLE 테이블

**테이블 코멘트**: 사용자 역할 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE USER_ROLE (
    USER_ROLE_ID VARCHAR(255) PRIMARY KEY,
    ROLE_CD VARCHAR(50) NOT NULL UNIQUE,
    ROLE_NM VARCHAR(255) NOT NULL,
    ROLE_DESC VARCHAR(1000),
    USE_YN BOOLEAN NOT NULL
);

COMMENT ON TABLE USER_ROLE IS '사용자 역할 정보를 저장하는 테이블';
COMMENT ON COLUMN USER_ROLE.USER_ROLE_ID IS '사용자 역할 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN USER_ROLE.ROLE_CD IS '역할 코드 (예: ADMIN, MANAGER, OPERATOR, MEMBER)';
COMMENT ON COLUMN USER_ROLE.ROLE_NM IS '역할명';
COMMENT ON COLUMN USER_ROLE.ROLE_DESC IS '역할 설명';
COMMENT ON COLUMN USER_ROLE.USE_YN IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `USER_ROLE_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 역할 고유 식별자 (UUID 형식) |
| `ROLE_CD` | VARCHAR(50) | NOT NULL, UNIQUE | 역할 코드 (예: ADMIN, MANAGER, OPERATOR, MEMBER) |
| `ROLE_NM` | VARCHAR(255) | NOT NULL | 역할명 |
| `ROLE_DESC` | VARCHAR(1000) | NULL | 역할 설명 |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `ROLE_CD` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 초기 데이터

애플리케이션 시작 시 다음 역할이 자동으로 생성됩니다:

1. **최고 관리자**
   - roleCd: `ADMIN`
   - roleNm: `최고 관리자`
   - roleDesc: `모든 권한을 가진 최고 관리자`

2. **관리자**
   - roleCd: `MANAGER`
   - roleNm: `관리자`
   - roleDesc: `사이트, 메뉴, 사용자 관리 권한`

3. **운영자**
   - roleCd: `OPERATOR`
   - roleNm: `운영자`
   - roleDesc: `파일, 로그 관리 권한`

4. **일반 사용자**
   - roleCd: `MEMBER`
   - roleNm: `일반 사용자`
   - roleDesc: `일반 사용자 권한`

### USER_ROLE_MENU 테이블

**테이블 코멘트**: 사용자 역할별 메뉴 권한 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE USER_ROLE_MENU (
    USER_ROLE_MENU_ID VARCHAR(255) PRIMARY KEY,
    USER_ROLE_ID VARCHAR(255) NOT NULL,
    MENU_ID VARCHAR(255) NOT NULL,
    PERM_READ VARCHAR(1) NOT NULL,
    PERM_CREATE VARCHAR(1) NOT NULL,
    PERM_UPDATE VARCHAR(1) NOT NULL,
    PERM_DELETE VARCHAR(1) NOT NULL,
    PERM_DOWNLOAD VARCHAR(1) NOT NULL,
    PERM_ALL VARCHAR(1) NOT NULL,
    USE_YN VARCHAR(1) NOT NULL
);

COMMENT ON TABLE USER_ROLE_MENU IS '사용자 역할별 메뉴 권한 정보를 저장하는 테이블';
COMMENT ON COLUMN USER_ROLE_MENU.USER_ROLE_MENU_ID IS '사용자 역할 메뉴 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN USER_ROLE_MENU.USER_ROLE_ID IS '사용자 역할 ID (USER_ROLE 테이블 참조)';
COMMENT ON COLUMN USER_ROLE_MENU.MENU_ID IS '메뉴 ID (MENUS 테이블 참조)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_READ IS '읽기 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_CREATE IS '등록 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_UPDATE IS '수정 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_DELETE IS '삭제 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_DOWNLOAD IS '다운로드 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.PERM_ALL IS '전체 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN USER_ROLE_MENU.USE_YN IS '활성화 여부 (Y/N, 기본값: Y)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `USER_ROLE_MENU_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 역할 메뉴 고유 식별자 (UUID 형식) |
| `USER_ROLE_ID` | VARCHAR(255) | NOT NULL | 사용자 역할 ID (USER_ROLE 테이블 참조) |
| `MENU_ID` | VARCHAR(255) | NOT NULL | 메뉴 ID (MENUS 테이블 참조) |
| `PERM_READ` | VARCHAR(1) | NOT NULL | 읽기 권한 (Y/N, 기본값: N) |
| `PERM_CREATE` | VARCHAR(1) | NOT NULL | 등록 권한 (Y/N, 기본값: N) |
| `PERM_UPDATE` | VARCHAR(1) | NOT NULL | 수정 권한 (Y/N, 기본값: N) |
| `PERM_DELETE` | VARCHAR(1) | NOT NULL | 삭제 권한 (Y/N, 기본값: N) |
| `PERM_DOWNLOAD` | VARCHAR(1) | NOT NULL | 다운로드 권한 (Y/N, 기본값: N) |
| `PERM_ALL` | VARCHAR(1) | NOT NULL | 전체 권한 (Y/N, 기본값: N) |
| `USE_YN` | VARCHAR(1) | NOT NULL | 활성화 여부 (Y/N, 기본값: Y) |

#### 인덱스

- `USER_ROLE_ID`와 `MENU_ID` 조합에 대한 인덱스가 권장됩니다.

### MEMBER_ROLE 테이블

**테이블 코멘트**: 사용자 역할 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE MEMBER_ROLE (
    MEMBER_ROLE_ID VARCHAR(255) PRIMARY KEY,
    ROLE_CD VARCHAR(50) NOT NULL UNIQUE,
    ROLE_NM VARCHAR(255) NOT NULL,
    ROLE_DESC VARCHAR(1000),
    USE_YN BOOLEAN NOT NULL
);

COMMENT ON TABLE MEMBER_ROLE IS '사용자 역할 정보를 저장하는 테이블';
COMMENT ON COLUMN MEMBER_ROLE.MEMBER_ROLE_ID IS '사용자 역할 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN MEMBER_ROLE.ROLE_CD IS '역할 코드 (예: VIP, PREMIUM, BASIC)';
COMMENT ON COLUMN MEMBER_ROLE.ROLE_NM IS '역할명';
COMMENT ON COLUMN MEMBER_ROLE.ROLE_DESC IS '역할 설명';
COMMENT ON COLUMN MEMBER_ROLE.USE_YN IS '활성화 여부 (기본값: true)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `MEMBER_ROLE_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 역할 고유 식별자 (UUID 형식) |
| `ROLE_CD` | VARCHAR(50) | NOT NULL, UNIQUE | 역할 코드 (예: VIP, PREMIUM, BASIC) |
| `ROLE_NM` | VARCHAR(255) | NOT NULL | 역할명 |
| `ROLE_DESC` | VARCHAR(1000) | NULL | 역할 설명 |
| `USE_YN` | BOOLEAN | NOT NULL | 활성화 여부 (기본값: true) |

#### 인덱스

- `ROLE_CD` 컬럼에 UNIQUE 제약조건이 있어 자동으로 인덱스가 생성됩니다.

#### 초기 데이터

애플리케이션 시작 시 다음 역할이 자동으로 생성됩니다:

1. **VIP 회원**
   - roleCd: `VIP`
   - roleNm: `VIP 회원`
   - roleDesc: `VIP 회원 권한`

2. **프리미엄 회원**
   - roleCd: `PREMIUM`
   - roleNm: `프리미엄 회원`
   - roleDesc: `프리미엄 회원 권한`

3. **일반 회원**
   - roleCd: `BASIC`
   - roleNm: `일반 회원`
   - roleDesc: `일반 회원 권한`

4. **비회원**
   - roleCd: `GUEST`
   - roleNm: `비회원`
   - roleDesc: `비회원 권한`

### MEMBER_ROLE_MENU 테이블

**테이블 코멘트**: 사용자 역할별 메뉴 권한 정보를 저장하는 테이블

#### 스키마

```sql
CREATE TABLE MEMBER_ROLE_MENU (
    MEMBER_ROLE_MENU_ID VARCHAR(255) PRIMARY KEY,
    MEMBER_ROLE_ID VARCHAR(255) NOT NULL,
    MENU_ID VARCHAR(255) NOT NULL,
    PERM_READ VARCHAR(1) NOT NULL,
    PERM_CREATE VARCHAR(1) NOT NULL,
    PERM_UPDATE VARCHAR(1) NOT NULL,
    PERM_DELETE VARCHAR(1) NOT NULL,
    PERM_DOWNLOAD VARCHAR(1) NOT NULL,
    PERM_ALL VARCHAR(1) NOT NULL,
    USE_YN VARCHAR(1) NOT NULL
);

COMMENT ON TABLE MEMBER_ROLE_MENU IS '사용자 역할별 메뉴 권한 정보를 저장하는 테이블';
COMMENT ON COLUMN MEMBER_ROLE_MENU.MEMBER_ROLE_MENU_ID IS '사용자 역할 메뉴 고유 식별자 (UUID 형식)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.MEMBER_ROLE_ID IS '사용자 역할 ID (MEMBER_ROLE 테이블 참조)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.MENU_ID IS '메뉴 ID (MENUS 테이블 참조)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_READ IS '읽기 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_CREATE IS '등록 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_UPDATE IS '수정 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_DELETE IS '삭제 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_DOWNLOAD IS '다운로드 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.PERM_ALL IS '전체 권한 (Y/N, 기본값: N)';
COMMENT ON COLUMN MEMBER_ROLE_MENU.USE_YN IS '활성화 여부 (Y/N, 기본값: Y)';
```

#### 컬럼 설명

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `MEMBER_ROLE_MENU_ID` | VARCHAR(255) | PRIMARY KEY, UUID | 사용자 역할 메뉴 고유 식별자 (UUID 형식) |
| `MEMBER_ROLE_ID` | VARCHAR(255) | NOT NULL | 사용자 역할 ID (MEMBER_ROLE 테이블 참조) |
| `MENU_ID` | VARCHAR(255) | NOT NULL | 메뉴 ID (MENUS 테이블 참조) |
| `PERM_READ` | VARCHAR(1) | NOT NULL | 읽기 권한 (Y/N, 기본값: N) |
| `PERM_CREATE` | VARCHAR(1) | NOT NULL | 등록 권한 (Y/N, 기본값: N) |
| `PERM_UPDATE` | VARCHAR(1) | NOT NULL | 수정 권한 (Y/N, 기본값: N) |
| `PERM_DELETE` | VARCHAR(1) | NOT NULL | 삭제 권한 (Y/N, 기본값: N) |
| `PERM_DOWNLOAD` | VARCHAR(1) | NOT NULL | 다운로드 권한 (Y/N, 기본값: N) |
| `PERM_ALL` | VARCHAR(1) | NOT NULL | 전체 권한 (Y/N, 기본값: N) |
| `USE_YN` | VARCHAR(1) | NOT NULL | 활성화 여부 (Y/N, 기본값: Y) |

#### 인덱스

- `MEMBER_ROLE_ID`와 `MENU_ID` 조합에 대한 인덱스가 권장됩니다.

## 엔티티 매핑

### UserEntity

```java
@Entity
@Table(name = "USERS")
@org.hibernate.annotations.Comment("사용자 및 관리자 정보를 저장하는 테이블")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "USER_ID")
    @Comment("사용자 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "USER_NM", unique = true, nullable = false)
    @Comment("사용자명 (로그인 ID)")
    private String username;
    
    @Column(name = "PASSWORD", nullable = false)
    @Comment("암호화된 비밀번호 (BCrypt 해시)")
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false)
    @Comment("사용자 역할 (USER: 관리자, MEMBER: 사용자)")
    private Role role;
    
    @Column(name = "NAME")
    @Comment("사용자 이름")
    private String name;
    
    @Column(name = "EMAIL")
    @Comment("이메일 주소")
    private String email;
    
    @Column(name = "AVATAR_URL")
    @Comment("아바타 이미지 URL")
    private String avatarUrl;
}
```

### SiteEntity

```java
@Entity
@Table(name = "SITES")
@org.hibernate.annotations.Comment("사이트 정보를 저장하는 테이블")
public class SiteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SITE_ID")
    @Comment("사이트 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "SITE_TYPE_CD", nullable = false)
    @Comment("사이트 타입 (공통코드 P001의 하위코드 사용)")
    private String siteType;
    
    @Column(name = "SITE_NM", nullable = false)
    @Comment("사이트명")
    private String siteName;
    
    @Column(name = "SITE_DESC", length = 1000)
    @Comment("사이트 설명")
    private String description;
    
    @Column(name = "CONTEXT_PATH", nullable = false, unique = true)
    @Comment("Context Path (빈 값 = root, 예: 'admin' = /admin)")
    private String contextPath;
    
    @Column(name = "VERSION", nullable = false)
    @Comment("사이트 버전")
    private String version;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### MenuEntity

```java
@Entity
@Table(name = "MENUS")
@org.hibernate.annotations.Comment("메뉴 정보를 저장하는 테이블 (사이트에 속하며 계층 구조 지원)")
public class MenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MENU_ID")
    @Comment("메뉴 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "SITE_ID", nullable = false)
    @Comment("사이트 ID (SITES 테이블 참조)")
    private String siteId;
    
    @Column(name = "MENU_NM", nullable = false)
    @Comment("메뉴명")
    private String name;
    
    @Column(name = "MENU_URL", length = 500)
    @Comment("메뉴 URL")
    private String url;
    
    @Column(name = "ICON_ID", length = 100)
    @Comment("메뉴 아이콘 ID (ICONS 테이블의 ICON_CD 참조)")
    private String icon;
    
    @Column(name = "DISP_ORD", nullable = false)
    @Comment("표시 순서")
    private Integer displayOrder = 0;
    
    @Column(name = "PARENT_ID")
    @Comment("부모 메뉴 ID (계층 구조용, 최상위 메뉴는 NULL)")
    private String parentId;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### IconEntity

```java
@Entity
@Table(name = "ICONS")
@org.hibernate.annotations.Comment("아이콘 정보를 저장하는 테이블")
public class IconEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ICON_ID")
    @Comment("아이콘 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "ICON_CD", nullable = false, unique = true)
    @Comment("아이콘 코드 (고유 식별자)")
    private String iconId;
    
    @Column(name = "ICON_NM", nullable = false)
    @Comment("아이콘명")
    private String name;
    
    @Column(name = "SVG_CODE", nullable = false, columnDefinition = "TEXT")
    @Comment("SVG 코드")
    private String svgCode;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### CmnCdEntity

```java
@Entity
@Table(name = "CMN_CD", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"PARENT_CD", "CD"})
})
@org.hibernate.annotations.Comment("공통코드 정보를 저장하는 테이블 (부모-자식 계층 구조 지원)")
public class CmnCdEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CMN_CD_ID")
    @Comment("공통코드 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "CD", nullable = false, length = 4)
    @Comment("공통코드 (P001~P999: 부모코드, C001~C999: 자식코드)")
    private String cd;
    
    @Column(name = "CD_NM", nullable = false)
    @Comment("공통코드명")
    private String name;
    
    @Column(name = "CD_DESC", length = 1000)
    @Comment("공통코드 설명")
    private String description;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
    
    @Column(name = "PARENT_CD", length = 4)
    @Comment("부모 코드 (부모코드인 경우 NULL)")
    private String parentCd;
}
```

### UserRoleEntity

```java
@Entity
@Table(name = "USER_ROLE")
@org.hibernate.annotations.Comment("사용자 역할 정보를 저장하는 테이블")
public class UserRoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "USER_ROLE_ID")
    @Comment("사용자 역할 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "ROLE_CD", nullable = false, unique = true, length = 50)
    @Comment("역할 코드 (예: ADMIN, MANAGER, OPERATOR, MEMBER)")
    private String roleCd;
    
    @Column(name = "ROLE_NM", nullable = false)
    @Comment("역할명")
    private String roleNm;
    
    @Column(name = "ROLE_DESC", length = 1000)
    @Comment("역할 설명")
    private String roleDesc;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
}
```

### UserRoleMenuEntity

```java
@Entity
@Table(name = "USER_ROLE_MENU")
@org.hibernate.annotations.Comment("사용자 역할별 메뉴 권한 정보를 저장하는 테이블")
public class UserRoleMenuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "USER_ROLE_MENU_ID")
    @Comment("사용자 역할 메뉴 고유 식별자 (UUID 형식)")
    private String id;
    
    @Column(name = "USER_ROLE_ID", nullable = false)
    @Comment("사용자 역할 ID (USER_ROLE 테이블 참조)")
    private String userRoleId;
    
    @Column(name = "MENU_ID", nullable = false)
    @Comment("메뉴 ID (MENUS 테이블 참조)")
    private String menuId;
    
    @Column(name = "PERM_READ", nullable = false)
    @Comment("읽기 권한 (기본값: false)")
    private Boolean permRead = false;
    
    @Column(name = "PERM_CREATE", nullable = false)
    @Comment("등록 권한 (기본값: false)")
    private Boolean permCreate = false;
    
    @Column(name = "PERM_UPDATE", nullable = false)
    @Comment("수정 권한 (기본값: false)")
    private Boolean permUpdate = false;
    
    @Column(name = "PERM_DELETE", nullable = false)
    @Comment("삭제 권한 (기본값: false)")
    private Boolean permDelete = false;
    
    @Column(name = "PERM_DOWNLOAD", nullable = false)
    @Comment("다운로드 권한 (기본값: false)")
    private Boolean permDownload = false;
    
    @Column(name = "PERM_ALL", nullable = false)
    @Comment("전체 권한 (기본값: false)")
    private Boolean permAll = false;
    
    @Column(name = "USE_YN", nullable = false)
    @Comment("활성화 여부 (기본값: true)")
    private Boolean enabled = true;
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

### MemberRepository

```java
public interface MemberRepository extends JpaRepository<MemberEntity, String> {
    Optional<MemberEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
```

### UserRoleRepository

```java
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, String> {
    Optional<UserRoleEntity> findByRoleCd(String roleCd);
    boolean existsByRoleCd(String roleCd);
    List<UserRoleEntity> findByEnabledTrueOrderByRoleCdAsc();
    List<UserRoleEntity> findAllByOrderByRoleCdAsc();
}
```

### UserRoleMenuRepository

```java
public interface UserRoleMenuRepository extends JpaRepository<UserRoleMenuEntity, String> {
    List<UserRoleMenuEntity> findByUserRoleId(String userRoleId);
    List<UserRoleMenuEntity> findByUserRoleIdAndEnabledTrue(String userRoleId);
    List<UserRoleMenuEntity> findByMenuId(String menuId);
    Optional<UserRoleMenuEntity> findByUserRoleIdAndMenuId(String userRoleId, String menuId);
    boolean existsByUserRoleIdAndMenuId(String userRoleId, String menuId);
    void deleteByUserRoleId(String userRoleId);
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

### MemberRepository 주요 쿼리

1. **사용자명으로 조회**
   ```java
   memberRepository.findByUsername(username)
   ```

2. **사용자명 존재 여부 확인**
   ```java
   memberRepository.existsByUsername(username)
   ```

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

### UserRoleRepository 주요 쿼리

1. **역할 코드로 조회**
   ```java
   userRoleRepository.findByRoleCd(roleCd)
   ```

2. **역할 코드 존재 여부 확인**
   ```java
   userRoleRepository.existsByRoleCd(roleCd)
   ```

3. **활성화된 역할 목록 조회**
   ```java
   userRoleRepository.findByEnabledTrueOrderByRoleCdAsc()
   ```

4. **전체 역할 목록 조회 (역할 코드 순)**
   ```java
   userRoleRepository.findAllByOrderByRoleCdAsc()
   ```

## 관계 및 제약조건

- 현재 프로젝트는 `USERS`, `MEMBERS`, `SITES`, `MENUS`, `ICONS`, `CMN_CD`, `USER_ROLE` 테이블을 사용합니다.
- `User`는 `USERS` 테이블에서 `ROLE = 'USER'`인 레코드를 조회하여 사용합니다.
- `Member`는 `MEMBERS` 테이블의 데이터를 기반으로 사용자 관리 화면과 API에서 사용하며, 로그인/권한 처리를 위해 `USERS` 테이블에도 `ROLE = 'MEMBER'` 계정을 함께 생성/삭제하여 동기화합니다.
- `SITES` 테이블은 사이트 정보를 관리하며, `CONTEXT_PATH`는 UNIQUE 제약조건이 있어 동일한 Context Path는 하나만 존재할 수 있습니다.
- `MENUS` 테이블은 메뉴 정보를 관리하며, `SITE_ID`를 통해 사이트에 속합니다.
- `MENUS` 테이블은 `PARENT_ID`를 통해 계층 구조를 지원합니다 (부모-하위 메뉴 관계).
- `MENUS` 테이블의 `ICON_ID`는 `ICONS` 테이블의 `ICON_CD`를 참조합니다.
- `ICONS` 테이블은 아이콘 정보를 관리하며, `ICON_CD`는 UNIQUE 제약조건이 있어 동일한 아이콘 코드는 하나만 존재할 수 있습니다.
- `CMN_CD` 테이블은 공통코드를 관리하며, `PARENT_CD`를 통해 계층 구조를 지원합니다.
- `CMN_CD` 테이블은 `(PARENT_CD, CD)` 조합에 UNIQUE 제약조건이 있습니다.

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
