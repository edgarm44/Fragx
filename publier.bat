@echo off
setlocal EnableExtensions
title Fragx - mise en ligne
cd /d "%~dp0"
set "WRANGLER_SEND_METRICS=false"

rem 1. Node.js 22.23.4 minimum (exige par Astro 7)
where node >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe la version LTS depuis https://nodejs.org
  echo ou en ligne de commande : winget install --id OpenJS.NodeJS.LTS -e
  echo Puis ferme cette fenetre et relance publier.bat.
  goto :fin
)
node -e "const [a,b,c]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&(b>23||(b===23&&c>=4)))?0:1)"
if errorlevel 1 (
  for /f %%v in ('node -v') do echo [ERREUR] Node.js %%v est trop ancien : il faut 22.23.4 ou plus recent.
  echo Mets-le a jour : winget upgrade --id OpenJS.NodeJS.LTS -e
  goto :fin
)

rem 2. Dependances pour Windows (reinstallees si absentes ou preparees sous Linux)
if not exist "node_modules\@esbuild\win32-x64" goto :installer
if not exist "node_modules\@rolldown\binding-win32-x64-msvc" goto :installer
goto :construire

:installer
echo Installation des dependances (une a deux minutes la premiere fois)...
call npm ci --no-audit --no-fund
if errorlevel 1 (
  echo [ERREUR] Installation des dependances impossible. Copie le message ci-dessus et envoie-le a Claude.
  goto :fin
)

:construire
echo.
echo Construction du site...
call npm run build
if errorlevel 1 (
  echo [ERREUR] La construction a echoue. Copie le message ci-dessus et envoie-le a Claude.
  goto :fin
)

rem 3. Connexion a Cloudflare (navigateur, uniquement la premiere fois)
call npx wrangler whoami 2>nul | findstr /i /c:"You are logged in" >nul
if errorlevel 1 (
  echo.
  echo Connexion a Cloudflare : une page va s'ouvrir dans ton navigateur, clique sur Allow.
  call npx wrangler login
  if errorlevel 1 (
    echo [ERREUR] Connexion a Cloudflare annulee ou impossible.
    goto :fin
  )
)

rem 4. Publication
echo.
echo Publication sur Cloudflare...
call npx wrangler deploy
if errorlevel 1 (
  echo.
  echo [ERREUR] La publication a echoue. Copie le message ci-dessus et envoie-le a Claude.
) else (
  echo.
  echo [OK] Site en ligne. L'adresse en https://...workers.dev est affichee ci-dessus.
)

:fin
echo.
pause
endlocal
