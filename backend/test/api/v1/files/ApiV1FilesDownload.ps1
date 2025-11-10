# API 테스트: 파일 다운로드
# 사용법: .\ApiV1FilesDownload.ps1 -FileName "uuid_filename.txt" -OutputPath "C:\downloads\"

param(
    [Parameter(Mandatory=$true)]
    [string]$FileName,
    
    [string]$OutputPath = "."
)

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 파일 다운로드 ===" -ForegroundColor Cyan
Write-Host "파일명: $FileName" -ForegroundColor Gray
Write-Host "저장 경로: $OutputPath" -ForegroundColor Gray

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-WebRequest -Uri (Get-ApiUrl "files/$FileName") `
        -Method GET `
        -Headers $headers
    
    if ($response.StatusCode -eq 200) {
        $outputFile = Join-Path $OutputPath $FileName
        [System.IO.File]::WriteAllBytes($outputFile, $response.Content)
        Write-Host "✅ 파일 다운로드 성공!" -ForegroundColor Green
        Write-Host "   저장 위치: $outputFile" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 다운로드 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   ⚠️  파일을 찾을 수 없습니다" -ForegroundColor Yellow
    }
}

