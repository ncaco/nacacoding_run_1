# API 테스트 스크립트
# 사용법: 서버 실행 후 PowerShell에서 .\test-api.ps1 실행

Write-Host "=== API 테스트 시작 ===" -ForegroundColor Cyan

# 1. 로그인 테스트
Write-Host "`n[1] 로그인 테스트..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✅ 로그인 성공!" -ForegroundColor Green
    Write-Host "   사용자: $($loginResponse.data.username)" -ForegroundColor Gray
    Write-Host "   역할: $($loginResponse.data.role)" -ForegroundColor Gray
    $token = $loginResponse.data.token
    Write-Host "   토큰: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ 로그인 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. 사용자 정보 조회 (인증 필요)
Write-Host "`n[2] 사용자 정보 조회 테스트..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $userMe = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/members/me" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ 사용자 정보 조회 성공!" -ForegroundColor Green
    Write-Host "   사용자명: $($userMe.data.username)" -ForegroundColor Gray
} catch {
    Write-Host "❌ 사용자 정보 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. 관리자 목록 조회 (USER 권한 필요)
Write-Host "`n[3] 관리자 목록 조회 테스트..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/users" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ 관리자 목록 조회 성공!" -ForegroundColor Green
    Write-Host "   총 관리자 수: $($users.data.Count)명" -ForegroundColor Gray
    foreach ($user in $users.data) {
        Write-Host "   - $($user.username) ($($user.role))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 관리자 목록 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ⚠️  USER(관리자) 권한이 필요합니다" -ForegroundColor Yellow
    }
}

# 3-1. 사용자(MEMBER) 목록 조회
Write-Host "`n[3-1] 사용자(MEMBER) 목록 조회 테스트..." -ForegroundColor Yellow
try {
    $members = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/members" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ 사용자 목록 조회 성공!" -ForegroundColor Green
    Write-Host "   총 사용자 수: $($members.data.Count)명" -ForegroundColor Gray
    foreach ($member in $members.data) {
        Write-Host "   - $($member.username)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 사용자 목록 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. 관리자 대시보드 테스트 (USER 권한 필요)
Write-Host "`n[4] 관리자 대시보드 테스트..." -ForegroundColor Yellow
try {
    $admin = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/users/dashboard" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ 관리자 대시보드 접근 성공!" -ForegroundColor Green
    Write-Host "   메시지: $($admin.data.status)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  관리자 대시보드 접근 실패 (권한 부족 가능): $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ⚠️  USER(관리자) 권한이 필요합니다" -ForegroundColor Yellow
    }
}

# 5. 로그 조회 테스트
Write-Host "`n[5] 로그 조회 테스트..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/logs" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ 로그 조회 성공!" -ForegroundColor Green
    Write-Host "   로그 수: $($logs.data.Count)개" -ForegroundColor Gray
} catch {
    Write-Host "❌ 로그 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. 로그아웃 테스트
Write-Host "`n[6] 로그아웃 테스트..." -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/logout" `
        -Method POST `
        -Headers $headers
    
    Write-Host "✅ 로그아웃 성공!" -ForegroundColor Green
    Write-Host "   메시지: $($logoutResponse.message)" -ForegroundColor Gray
    
    # 로그아웃 후 토큰 사용 시도 (실패해야 함)
    Write-Host "`n   로그아웃된 토큰으로 요청 시도..." -ForegroundColor Gray
    try {
        $testAfterLogout = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/members/me" `
            -Method GET `
            -Headers $headers
        Write-Host "   ⚠️  토큰이 여전히 유효합니다 (블랙리스트 확인 필요)" -ForegroundColor Yellow
    } catch {
        Write-Host "   ✅ 로그아웃된 토큰이 거부되었습니다" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 로그아웃 실패: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== API 테스트 완료 ===" -ForegroundColor Cyan

