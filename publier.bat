@echo off
setlocal EnableExtensions
title Fragx - publier
cd /d "%~dp0"

rem 1. Git installe ?
where git >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Git n'est pas installe.
  echo Installe-le depuis https://git-scm.com/download/win
  echo ou en ligne de commande : winget install --id Git.Git -e
  goto :fin
)

rem 2. Reglages une fois pour toutes (silencieux)
set "REPO=%CD:\=/%"
git config --global --get-all safe.directory | findstr /x /c:"%REPO%" >nul 2>&1
if errorlevel 1 git config --global --add safe.directory "%REPO%"
rem Toujours le compte edgarm44 : pas de choix de compte a chaque envoi
git config credential.https://github.com.username edgarm44

rem 3. Enregistrer les modifications locales avec un message automatique
git add -A
git diff --cached --quiet
if errorlevel 1 (
  echo [1/3] Enregistrement des modifications...
  git commit -q -m "Mise a jour du site du %date% a %time:~0,5%"
  if errorlevel 1 goto :echec
) else (
  echo [1/3] Aucune modification locale.
)

rem 4. Recuperer d'eventuels changements faits en ligne, puis envoyer
echo [2/3] Envoi vers GitHub...
git pull -q --rebase origin main
if errorlevel 1 (
  git rebase --abort >nul 2>&1
  echo [ERREUR] Le depot en ligne contient des changements incompatibles avec ceux de ce PC.
  echo          Rien n'a ete envoye. Dis a Claude : conflit lors de la publication.
  goto :fin
)
git push -q -u origin main
if errorlevel 1 goto :echec

rem 5. Attendre que GitHub ait reconstruit le site, puis l'ouvrir
echo [3/3] Mise en ligne (1 a 2 minutes)...
for /f %%c in ('git rev-parse HEAD') do set "COMMIT=%%c"
powershell -NoProfile -ExecutionPolicy Bypass -File "outils\attendre-publication.ps1" -Commit %COMMIT%
goto :fin

:echec
echo.
echo [ERREUR] L'envoi a echoue. Copie le message ci-dessus et envoie-le a Claude.

:fin
echo.
echo Cette fenetre se ferme dans 15 secondes (ou appuie sur une touche).
timeout /t 15 >nul
endlocal
