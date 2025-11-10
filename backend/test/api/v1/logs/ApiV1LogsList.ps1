# API 테스트: 로그 목록 조회
# 사용법: .\ApiV1LogsList.ps1

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 로그 목록 조회 ===" -ForegroundColor Cyan

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "logs") `
        -Method GET `
        -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ 로그 목록 조회 성공!" -ForegroundColor Green
        Write-Host "   로그 수: $($response.data.Count)개" -ForegroundColor Gray
        Write-Response -Response $response -Title "로그 목록"
    } else {
        Write-Host "❌ 조회 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

