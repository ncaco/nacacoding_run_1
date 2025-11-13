# API 테스트: 관리자 대시보드
# 사용법: .\ApiV1UsersDashboard.ps1

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 관리자 대시보드 조회 ===" -ForegroundColor Cyan

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "users/dashboard") `
        -Method GET `
        -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ 관리자 대시보드 접근 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "대시보드 정보"
    } else {
        Write-Host "❌ 접근 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 접근 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ⚠️  USER(관리자) 권한이 필요합니다" -ForegroundColor Yellow
    }
}

