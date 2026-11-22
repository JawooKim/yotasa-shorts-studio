@echo off
chcp 65001 > nul
title K-Shorts Studio - 윈도우 설치 파일(.exe) 패키징 빌더
echo ======================================================================
echo   K-Shorts Studio Windows Setup Installer Builder
echo   한국어 AI 쇼츠 자동화 제작 데스크톱 프로그램 정식 출시 빌더
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] 프론트엔드 및 백엔드 엔진 최신 컴파일 중...
call node scripts\run-edition.js buyer npm run build
if %errorlevel% neq 0 (
    echo [오류] 소스 컴파일에 실패했습니다. 에러를 확인해주세요.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Windows NSIS 설치 프로그램(.exe) 정식 패키징 중...
call npx electron-builder --win nsis
if %errorlevel% neq 0 (
    echo [오류] 윈도우 인스톨러 패키징에 실패했습니다.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] 설치 파일 SHA-256 체크섬(.sha256) 생성 중...
call node scripts\make-checksum.js
if %errorlevel% neq 0 (
    echo [오류] 체크섬 파일 생성에 실패했습니다.
    pause
    exit /b %errorlevel%
)

echo.
echo ======================================================================
echo   🎉 [성공] 윈도우 전용 설치 파일(.exe) 생성이 완료되었습니다!
echo   ※ 릴리즈 업로드 시 .exe 와 .sha256 파일을 함께 올려야 자동 업데이트가 동작합니다.
echo   📁 생성 위치: release\K-Shorts Studio-Setup-*.exe (+ .sha256)
echo ======================================================================
echo.
explorer "%~dp0release"
pause
