@echo off
setlocal EnableExtensions
title Fragx - push GitHub

rem Se placer dans le dossier du script (racine du depot)
cd /d "%~dp0"

rem 1. Verifier que Git est installe
where git >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Git n'est pas installe.
  echo Installe-le depuis https://git-scm.com/download/win
  echo ou en ligne de commande : winget install --id Git.Git -e
  goto :fin
)

rem 2. Declarer le dossier comme sur (evite l'erreur "dubious ownership")
set "REPO=%CD:\=/%"
git config --global --get-all safe.directory | findstr /x /c:"%REPO%" >nul 2>&1
if errorlevel 1 git config --global --add safe.directory "%REPO%"

rem 3. Commiter les modifications locales eventuelles
git status --porcelain > "%TEMP%\fragx_status.txt"
for %%A in ("%TEMP%\fragx_status.txt") do set "TAILLE=%%~zA"
del "%TEMP%\fragx_status.txt" >nul 2>&1
if not "%TAILLE%"=="0" (
  echo Modifications non commitees :
  git status --short
  echo.
  set /p "MSG=Message du commit (Entree pour annuler) : "
  call :commit
  if errorlevel 1 goto :fin
)

rem 4. Pousser vers GitHub
echo.
echo Commits a envoyer :
git log --oneline origin/main..main 2>nul || git log --oneline
echo.
echo Envoi vers https://github.com/edgarm44/Fragx ...
echo (au premier envoi, une fenetre de connexion GitHub s'ouvre : utilise le compte edgarm44)
git push -u origin main
if errorlevel 1 (
  echo.
  echo [ERREUR] Le push a echoue. Copie le message ci-dessus et envoie-le a Claude.
) else (
  echo.
  echo [OK] Depot a jour : https://github.com/edgarm44/Fragx
)
goto :fin

:commit
if "%MSG%"=="" (
  echo Commit annule, rien n'est envoye.
  exit /b 1
)
git add -A
git commit -m "%MSG%"
exit /b %errorlevel%

:fin
echo.
pause
endlocal
