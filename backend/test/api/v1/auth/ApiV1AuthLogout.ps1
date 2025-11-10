# API 테스트: 로그아웃
# 사용법: .\ApiV1AuthLogout.ps1

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 로그아웃 테스트 ===" -ForegroundColor Cyan

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "auth/logout") `
        -Method POST `
        -Headers $headers
    
    if ($response.success) {
        Remove-Token
        Write-Host "✅ 로그아웃 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "로그아웃 응답"
    } else {
        Write-Host "❌ 로그아웃 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 로그아웃 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

