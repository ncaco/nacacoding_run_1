# 프로젝트 사양서

## 프로젝트 개요

- **프로젝트명**: nacacoding_run_1
- **백엔드**: Spring Boot 4.0.0-SNAPSHOT (Java 21)
- **프론트엔드**: Next.js 16.0.1 (React 19.2.0, TypeScript)
- **데이터베이스**: H2 (인메모리)
- **인증**: JWT 기반 인증 시스템

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

## 작업 현황

### 완료된 작업
- [x] Spring Boot 프로젝트 설정
- [x] JWT 인증 시스템 구현
- [x] 사용자 관리 API 구현
- [x] 파일 업로드/다운로드 기능
- [x] 로그 관리 기능
- [x] Swagger/OpenAPI 문서화
- [x] 예외 처리 (GlobalExceptionHandler)
- [x] 초기 계정 생성 로직 개선 (@PostConstruct → ApplicationReadyEvent)
- [x] 사용자/관리자 로그인 엔드포인트 분리
- [x] 사용자/관리자 로그아웃 엔드포인트 분리

### 진행 중인 작업
- [ ] 프론트엔드 API 연동
- [ ] 데이터베이스 스키마 문서화

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

