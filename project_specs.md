# 프로젝트 사양서

## 프로젝트 개요

- **프로젝트명**: nacacoding_run_1
- **백엔드**: Spring Boot 4.0.0-SNAPSHOT (Java 21)
- **프론트엔드**: Next.js 16.0.1 (React 19.2.0, TypeScript)
- **데이터베이스**: H2 (인메모리)
- **인증**: JWT 기반 인증 시스템
- **사이트 구성**:
  - **통합관리사이트 (ADMIN)**: 시스템 관리 및 통계 조회를 위한 관리자 사이트
  - **메인포털사이트 (PORTAL)**: 일반 사용자를 위한 메인 포털 사이트

## 프로젝트 구조

```
nacacoding_run_1/
├── backend/          # Spring Boot 백엔드
├── frontend/         # Next.js 프론트엔드
├── database/         # 데이터베이스 관련 파일
└── test/             # API 테스트 스크립트
```

## 주요 기능

### 인증 (Auth)
- [x] JWT 기반 로그인/로그아웃
- [x] 사용자/관리자 로그인 엔드포인트 분리
- [x] 사용자/관리자 로그아웃 엔드포인트 분리
- [x] 토큰 블랙리스트 관리
- [x] 비밀번호 암호화 (BCrypt)

### 사용자 관리
- [x] 관리자(USER 역할) 관리 API
- [x] 사용자(MEMBER 역할) 관리 API
- [x] 초기 계정 자동 생성 (admin, member)

### 파일 관리
- [x] 파일 업로드
- [x] 파일 다운로드

### 로그 관리
- [x] 로그 목록 조회
- [x] 로그 추가

### 사이트 관리
- [x] 사이트 CRUD (생성, 조회, 수정, 삭제)

### 메뉴 관리
- [x] 메뉴 CRUD (생성, 조회, 수정, 삭제)
- [x] 사이트별 메뉴 조회
- [x] 계층 구조 메뉴 지원 (부모/하위 메뉴)

## API 엔드포인트

### 인증
- `POST /api/v1/auth/login/user` - 사용자(MEMBER) 로그인
- `POST /api/v1/auth/login/admin` - 관리자(USER) 로그인
- `POST /api/v1/auth/logout/user` - 사용자(MEMBER) 로그아웃
- `POST /api/v1/auth/logout/admin` - 관리자(USER) 로그아웃

### 사용자 (관리자)
- `GET /api/v1/users` - 관리자 목록 조회
- `POST /api/v1/users` - 관리자 생성

### 멤버 (사용자)
- `GET /api/v1/members/me` - 현재 사용자 정보
- `GET /api/v1/members` - 멤버 목록 조회

### 파일
- `POST /api/v1/files` - 파일 업로드
- `GET /api/v1/files/{name}` - 파일 다운로드

### 로그
- `GET /api/v1/logs` - 로그 목록 조회
- `POST /api/v1/logs` - 로그 추가

### 사이트 관리
- `GET /api/v1/site` - 사이트 목록 조회 (관리자 권한 필요)
- `GET /api/v1/site/{id}` - 사이트 조회 (관리자 권한 필요)
- `GET /api/v1/site/type/{siteType}` - 사이트 타입으로 조회 (관리자 권한 필요)
- `POST /api/v1/site` - 사이트 생성 (관리자 권한 필요)
- `PUT /api/v1/site/{id}` - 사이트 수정 (관리자 권한 필요)
- `DELETE /api/v1/site/{id}` - 사이트 삭제 (관리자 권한 필요)

### 메뉴 관리
- `GET /api/v1/menu` - 메뉴 목록 조회 (관리자 권한 필요)
- `GET /api/v1/menu/{id}` - 메뉴 조회 (관리자 권한 필요)
- `GET /api/v1/menu/site/{siteId}` - 사이트별 메뉴 목록 조회 (관리자 권한 필요)
- `GET /api/v1/menu/site/{siteId}/enabled` - 사이트별 활성화된 메뉴 목록 조회 (관리자 권한 필요)
- `POST /api/v1/menu` - 메뉴 생성 (관리자 권한 필요)
- `PUT /api/v1/menu/{id}` - 메뉴 수정 (관리자 권한 필요)
- `DELETE /api/v1/menu/{id}` - 메뉴 삭제 (관리자 권한 필요)

## 작업 현황

### 완료된 작업
- [x] Spring Boot 프로젝트 설정
- [x] JWT 인증 시스템 구현
- [x] 사용자 관리 API 구현
- [x] 파일 업로드/다운로드 기능
- [x] 로그 관리 기능
- [x] Swagger/OpenAPI 문서화
- [x] Swagger 태그 순서 설정 (01_인증, 02_관리자, 03_사용자, 04_로그, 05_파일, 06_사이트, 07_메뉴)
- [x] 예외 처리 (GlobalExceptionHandler)
- [x] 인증 실패 시 JSON 응답 처리 (CustomAuthenticationEntryPoint, CustomAccessDeniedHandler)
- [x] 초기 계정 생성 로직 개선 (@PostConstruct → ApplicationReadyEvent)
- [x] 사용자/관리자 로그인 엔드포인트 분리
- [x] 사용자/관리자 로그아웃 엔드포인트 분리
- [x] 사이트 관리 CRUD API 구현
- [x] 메뉴 관리 CRUD API 구현
- [x] 데이터베이스 스키마 문서화 (db_structure.md)

### 진행 중인 작업
- [ ] 프론트엔드 API 연동
  - [x] 포털 사이트 기본 디자인 구현 (Supabase 스타일)
  - [x] 헤더/네비게이션 컴포넌트
  - [x] 히어로 섹션
  - [x] 기능 소개 섹션
  - [x] 푸터
  - [x] 로그인/회원가입 페이지 UI
  - [x] 관리자 페이지 레이아웃 (헤더 + 사이드바)
  - [x] 사이드바 슬라이드 기능
  - [x] 탭 기반 콘텐츠 영역
  - [x] 관리자 대시보드 페이지
  - [x] 사이트 관리 페이지
  - [x] 메뉴 관리 페이지
  - [x] 사용자 관리 페이지
  - [x] 파일 관리 페이지
  - [x] 로그 관리 페이지
  - [x] 다크모드 지원 (next-themes)
  - [ ] API 연동 (인증, 데이터 조회 등)

### 예정된 작업
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 환경 변수 설정 개선
- [ ] 프로덕션 배포 설정

## 기술 스택

### 백엔드
- Spring Boot 4.0.0-SNAPSHOT
- Spring Security
- Spring Data JPA
- H2 Database
- JWT (jjwt 0.12.6)
- Swagger/OpenAPI (springdoc-openapi)

### 프론트엔드
- Next.js 16.0.1
- React 19.2.0
- TypeScript
- Tailwind CSS 4

## 초기 계정 정보

- **관리자**: username: `admin`, password: `admin123`, role: `USER`
- **사용자**: username: `member`, password: `member123`, role: `MEMBER`

## 참고 사항

- H2 콘솔: http://localhost:8080/h2-console
- Swagger UI: http://localhost:8080/swagger-ui.html
- API 문서: http://localhost:8080/v3/api-docs

