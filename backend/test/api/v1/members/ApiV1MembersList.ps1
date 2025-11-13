# API 테스트: 사용자(MEMBER) 목록 조회
# 사용법: .\ApiV1MembersList.ps1

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 사용자(MEMBER) 목록 조회 ===" -ForegroundColor Cyan

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "members") `
        -Method GET `
        -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ 사용자 목록 조회 성공!" -ForegroundColor Green
        Write-Host "   총 사용자 수: $($response.data.Count)명" -ForegroundColor Gray
        foreach ($member in $response.data) {
            Write-Host "   - $($member.username)" -ForegroundColor Gray
        }
        Write-Response -Response $response -Title "사용자 목록"
    } else {
        Write-Host "❌ 조회 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

