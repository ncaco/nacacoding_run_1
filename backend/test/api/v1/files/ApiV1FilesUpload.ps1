# API 테스트: 파일 업로드
# 사용법: .\ApiV1FilesUpload.ps1 -FilePath "C:\path\to\file.txt"
# 주의: PowerShell 6.0+ (Core) 필요. Windows PowerShell 5.1에서는 -Form 파라미터가 지원되지 않습니다.

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# 공통 설정 로드
. $PSScriptRoot\..\..\..\_config.ps1

Write-Host "=== 파일 업로드 ===" -ForegroundColor Cyan

if (-not (Test-Path $FilePath)) {
    Write-Host "❌ 파일을 찾을 수 없습니다: $FilePath" -ForegroundColor Red
    exit 1
}

$headers = Get-AuthHeaders
if (-not $headers.Authorization) {
    Write-Host "❌ 토큰이 없습니다. 먼저 로그인하세요." -ForegroundColor Red
    Write-Host "   사용법: .\ApiV1AuthLogin.ps1" -ForegroundColor Yellow
    exit 1
}

try {
    $fileName = [System.IO.Path]::GetFileName($FilePath)
    $fileContent = Get-Item -Path $FilePath
    
    # PowerShell 5.1+ 에서는 -InFile 사용
    $form = @{
        file = $fileContent
    }
    
    # Content-Type 헤더 제거 (multipart/form-data는 자동 설정됨)
    $uploadHeaders = $headers.Clone()
    $uploadHeaders.Remove("Content-Type")
    
    $response = Invoke-RestMethod -Uri (Get-ApiUrl "files") `
        -Method POST `
        -Headers $uploadHeaders `
        -Form $form
    
    if ($response.success) {
        Write-Host "✅ 파일 업로드 성공!" -ForegroundColor Green
        Write-Response -Response $response -Title "업로드 결과"
    } else {
        Write-Host "❌ 업로드 실패: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 업로드 실패: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   상세: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

