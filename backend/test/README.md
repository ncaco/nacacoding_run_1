# API 테스트 스크립트

각 API 엔드포인트를 개별적으로 테스트할 수 있는 PowerShell 스크립트 모음입니다.

## 구조

```
test/
├── _config.ps1              # 공통 설정 (URL, 토큰 관리)
├── api/
│   └── v1/
│       ├── auth/
│       │   ├── ApiV1AuthLogin.ps1
│       │   └── ApiV1AuthLogout.ps1
│       ├── users/
│       │   ├── ApiV1UsersMe.ps1
│       │   ├── ApiV1UsersList.ps1
│       │   └── ApiV1UsersCreate.ps1
│       ├── admin/
│       │   └── ApiV1AdminDashboard.ps1
│       ├── files/
│       │   ├── ApiV1FilesUpload.ps1
│       │   └── ApiV1FilesDownload.ps1
│       └── logs/
│           ├── ApiV1LogsList.ps1
│           └── ApiV1LogsAppend.ps1
└── README.md
```

## 사용 방법

### 1. 기본 사용법

각 스크립트는 독립적으로 실행할 수 있습니다:

```powershell
# 로그인
.\test\api\v1\auth\ApiV1AuthLogin.ps1

# 사용자 정보 조회
.\test\api\v1\users\ApiV1UsersMe.ps1
```

### 2. 파라미터 사용

일부 스크립트는 파라미터를 받습니다:

```powershell
# 다른 사용자로 로그인
.\test\api\v1\auth\ApiV1AuthLogin.ps1 -Username user -Password user123

# 사용자 생성
.\test\api\v1\users\ApiV1UsersCreate.ps1 -Username newuser -Password pass123 -Role USER

# 파일 업로드
.\test\api\v1\files\ApiV1FilesUpload.ps1 -FilePath "C:\test.txt"

# 로그 추가
.\test\api\v1\logs\ApiV1LogsAppend.ps1 -Message "테스트 로그" -Level "INFO"
```

### 3. 토큰 관리

- 로그인 시 토큰이 자동으로 `test\.token` 파일에 저장됩니다
- 이후 요청은 자동으로 저장된 토큰을 사용합니다
- 로그아웃 시 토큰이 삭제됩니다

## API 엔드포인트 목록

### 인증 (Auth)
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃

### 사용자 (Users)
- `GET /api/v1/users/me` - 현재 사용자 정보
- `GET /api/v1/users` - 사용자 목록
- `POST /api/v1/users` - 사용자 생성

### 관리자 (Admin)
- `GET /api/v1/admin/dashboard` - 관리자 대시보드 (ADMIN 권한 필요)

### 파일 (Files)
- `POST /api/v1/files` - 파일 업로드
- `GET /api/v1/files/{name}` - 파일 다운로드

### 로그 (Logs)
- `GET /api/v1/logs` - 로그 목록
- `POST /api/v1/logs` - 로그 추가

## 설정 변경

`_config.ps1` 파일에서 기본 설정을 변경할 수 있습니다:

```powershell
$script:BaseUrl = "http://localhost:8080"  # 서버 URL
$script:ApiVersion = "v1"                  # API 버전
```

## 주의사항

1. 대부분의 API는 인증이 필요합니다. 먼저 로그인하세요.
2. 관리자 API는 ADMIN 권한이 필요합니다.
3. 파일 업로드/다운로드는 인증이 필요합니다.

