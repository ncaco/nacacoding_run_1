# API 테스트: 로그인
# 사용법: .\ApiV1AuthLogin.ps1 -Username admin -Password admin123

param(
    [string]$Username = "admin",
    [string]$Password = "admin123"
)

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 로그인 테스트 ===" -ForegroundColor Cyan
Write-Host "사용자: $Username" -ForegroundColor Gray

try {
    $body = @{
        username = $Username
        password = $Password
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "auth/login") `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    if ($response.success -and $response.data.token) {
        Save-Token -Token $response.data.token
        Write-Host "✅ 로그인 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "로그인 응답"
    } else {
        Write-Host "❌ 로그인 실패: 응답 형식이 올바르지 않습니다" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 로그인 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    exit 1
}

