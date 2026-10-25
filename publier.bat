@echo off
setlocal EnableExtensions
title Fragx - publier
cd /d "%~dp0"
set "SITE=https://edgarm44.github.io/Fragx/"
set "ACTIONS=https://github.com/edgarm44/Fragx/actions"

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
if "%TAILLE%"=="0" goto :envoyer
echo Modifications non commitees :
git status --short
echo.
set "MSG="
set /p "MSG=Message du commit (Entree pour annuler) : "
if not defined MSG (
  echo Publication annulee.
  goto :fin
)
git add -A
git commit -m "%MSG%"
if errorlevel 1 goto :fin

rem 4. Envoyer sur GitHub : la publication du site se lance automatiquement
:envoyer
echo.
echo Envoi vers https://github.com/edgarm44/Fragx ...
git push -u origin main
if not errorlevel 1 goto :envoye

rem Envoi refuse : l'historique local a-t-il ete reecrit ?
git merge-base --is-ancestor origin/main main >nul 2>&1
if not errorlevel 1 goto :echec_envoi
echo.
echo L'historique local a ete reecrit (par exemple pour masquer une adresse e-mail).
echo Il faut remplacer l'historique en ligne par celui de ce PC.
set "REP="
set /p "REP=Remplacer l'historique sur GitHub ? (O/N) : "
if /i not "%REP%"=="O" goto :echec_envoi
git push --force-with-lease -u origin main
if errorlevel 1 goto :echec_envoi
goto :envoye

:echec_envoi
echo.
echo [ERREUR] L'envoi a echoue. Copie le message ci-dessus et envoie-le a Claude.
goto :fin

:envoye
echo.
echo [OK] Code envoye. GitHub construit et met en ligne le site (1 a 2 minutes).
echo      Suivi de la publication : %ACTIONS%
echo      Adresse du site         : %SITE%
start "" "%ACTIONS%"

:fin
echo.
pause
endlocal
