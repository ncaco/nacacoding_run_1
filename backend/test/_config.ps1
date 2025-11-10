# 공통 설정 파일
# 각 테스트 스크립트에서 . $PSScriptRoot\_config.ps1 로 로드

$script:BaseUrl = "http://localhost:8080"
$script:ApiVersion = "v1"
$script:TokenFile = "$PSScriptRoot\.token"

# 토큰 저장
function Save-Token {
    param([string]$Token)
    $Token | Out-File -FilePath $script:TokenFile -Encoding utf8 -NoNewline
    Write-Host "✅ 토큰이 저장되었습니다" -ForegroundColor Green
}

# 토큰 로드
function Get-Token {
    if (Test-Path $script:TokenFile) {
        return Get-Content -Path $script:TokenFile -Raw
    }
    return $null
}

# 토큰 삭제
function Remove-Token {
    if (Test-Path $script:TokenFile) {
        Remove-Item -Path $script:TokenFile -Force
        Write-Host "✅ 토큰이 삭제되었습니다" -ForegroundColor Green
    }
}

# 인증 헤더 생성
function Get-AuthHeaders {
    $token = Get-Token
    if ($token) {
        return @{
            Authorization = "Bearer $token"
        }
    }
    return @{}
}

# API URL 생성
function Get-ApiUrl {
    param([string]$Path)
    return "$script:BaseUrl/api/$script:ApiVersion/$Path"
}

# 응답 출력
function Write-Response {
    param($Response, [string]$Title = "응답")
    
    Write-Host "`n=== $Title ===" -ForegroundColor Cyan
    if ($Response) {
        Write-Host ($Response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
    }
}

