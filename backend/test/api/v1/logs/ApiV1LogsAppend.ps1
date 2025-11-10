# API 테스트: 로그 추가
# 사용법: .\ApiV1LogsAppend.ps1 -Message "테스트 로그" -Level "INFO"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [string]$Level = "INFO"
)

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 로그 추가 ===" -ForegroundColor Cyan
Write-Host "메시지: $Message" -ForegroundColor Gray
Write-Host "레벨: $Level" -ForegroundColor Gray

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $body = @{
        message = $Message
        level = $Level
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "logs") `
        -Method POST `
        -ContentType "application/json" `
        -Headers $headers `
        -Body $body
    
    if ($response.success) {
        Write-Host "✅ 로그 추가 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "로그 추가 결과"
    } else {
        Write-Host "❌ 추가 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 추가 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

