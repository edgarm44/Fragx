@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Fragx - mise en ligne
cd /d "%~dp0"
set "WRANGLER_SEND_METRICS=false"
set "LOG=%~dp0publier.log"
echo Journal de publication Fragx - %date% %time% > "%LOG%"

rem ---------------------------------------------------------------------
rem 1. Node.js 22.23.4 minimum (exige par Astro 7)
rem ---------------------------------------------------------------------
echo [1/5] Verification de Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js absent >> "%LOG%"
  echo.
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe la version LTS depuis https://nodejs.org
  echo ou en ligne de commande : winget install --id OpenJS.NodeJS.LTS -e
  echo Puis ferme cette fenetre et relance publier.bat.
  goto :fin
)
for /f %%v in ('node -v') do set "NODEV=%%v"
echo Node %NODEV% >> "%LOG%"
node -e "const [a,b,c]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&(b>23||(b===23&&c>=4)))?0:1)"
if errorlevel 1 (
  echo.
  echo [ERREUR] Node.js %NODEV% est trop ancien : il faut 22.23.4 ou plus recent.
  echo Mets-le a jour : winget upgrade --id OpenJS.NodeJS.LTS -e
  goto :fin
)
echo       Node.js %NODEV% OK

rem ---------------------------------------------------------------------
rem 2. Dependances pour Windows
rem ---------------------------------------------------------------------
if not exist "node_modules\@esbuild\win32-x64" goto :installer
if not exist "node_modules\@rolldown\binding-win32-x64-msvc" goto :installer
if not exist "node_modules\@cloudflare\workerd-windows-64" goto :installer
echo [2/5] Dependances deja installees
goto :construire

:installer
echo [2/5] Installation des dependances (1 a 2 minutes)...
echo === npm ci === >> "%LOG%"
call npm ci --no-audit --no-fund >> "%LOG%" 2>&1
if errorlevel 1 set "ETAPE=installation des dependances" & goto :echec

:construire
echo [3/5] Construction du site...
echo === npm run build === >> "%LOG%"
call npm run build >> "%LOG%" 2>&1
if errorlevel 1 set "ETAPE=construction du site" & goto :echec
if not exist "dist\index.html" set "ETAPE=construction du site (dist\index.html absent)" & goto :echec

rem ---------------------------------------------------------------------
rem 3. Connexion a Cloudflare (navigateur, seulement la premiere fois)
rem ---------------------------------------------------------------------
echo [4/5] Verification de la connexion Cloudflare...
echo === wrangler whoami === >> "%LOG%"
call npx --no-install wrangler whoami > "%TEMP%\fragx_whoami.txt" 2>&1
type "%TEMP%\fragx_whoami.txt" >> "%LOG%"
findstr /i /c:"logged in" "%TEMP%\fragx_whoami.txt" >nul
if not errorlevel 1 goto :publier

echo.
echo       Une page Cloudflare va s'ouvrir dans ton navigateur :
echo       connecte-toi puis clique sur "Allow". Reviens ensuite ici.
echo.
echo === wrangler login === >> "%LOG%"
call npx --no-install wrangler login >> "%LOG%" 2>&1
call npx --no-install wrangler whoami > "%TEMP%\fragx_whoami.txt" 2>&1
type "%TEMP%\fragx_whoami.txt" >> "%LOG%"
findstr /i /c:"logged in" "%TEMP%\fragx_whoami.txt" >nul
if errorlevel 1 set "ETAPE=connexion a Cloudflare" & goto :echec

rem ---------------------------------------------------------------------
rem 4. Publication
rem ---------------------------------------------------------------------
:publier
echo [5/5] Publication sur Cloudflare...
echo === wrangler deploy === >> "%LOG%"
call npx --no-install wrangler deploy > "%TEMP%\fragx_deploy.txt" 2>&1
set "CODE=%errorlevel%"
type "%TEMP%\fragx_deploy.txt" >> "%LOG%"
if not "%CODE%"=="0" set "ETAPE=publication" & goto :echec

echo.
echo [OK] Site en ligne :
findstr /r /c:"https://.*workers\.dev" "%TEMP%\fragx_deploy.txt"
goto :fin

rem ---------------------------------------------------------------------
:echec
echo.
echo [ERREUR] Echec pendant l'etape : %ETAPE%
echo ----- fin du journal -----
powershell -NoProfile -Command "Get-Content -LiteralPath '%LOG%' -Tail 25"
echo --------------------------
findstr /i /c:"workers.dev subdomain" "%LOG%" >nul && (
  echo Ton compte n'a pas encore de sous-domaine workers.dev :
  echo ouvre https://dash.cloudflare.com, menu Workers et Pages, choisis un sous-domaine, puis relance.
)
findstr /i /c:"verify your email" "%LOG%" >nul && (
  echo Confirme ton adresse e-mail Cloudflare avec le lien recu, puis relance.
)
echo.
echo Le journal complet est dans publier.log : dis a Claude de le lire.

:fin
echo.
pause
endlocal
