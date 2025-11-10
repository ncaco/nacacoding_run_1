# API 테스트: 사용자 생성
# 사용법: .\ApiV1UsersCreate.ps1 -Username testuser -Password test123 -Role USER

param(
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$Password,
    
    [string]$Role = "USER"
)

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 사용자 생성 ===" -ForegroundColor Cyan
Write-Host "사용자명: $Username" -ForegroundColor Gray
Write-Host "역할: $Role" -ForegroundColor Gray

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $uri = (Get-ApiUrl "users") + "?username=$Username&password=$Password&role=$Role"
    $response = Invoke-RestMethod -Uri $uri `
        -Method POST `
        -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ 사용자 생성 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "생성된 사용자"
    } else {
        Write-Host "❌ 생성 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 생성 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

