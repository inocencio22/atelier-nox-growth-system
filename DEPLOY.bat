@echo off
echo ============================================
echo  Atelier Nox - Deploy para Vercel
echo ============================================
echo.
cd /d "%~dp0"
echo Pasta: %CD%
echo.

echo [1/4] A remover lock files do git...
if exist .git\HEAD.lock del /f .git\HEAD.lock && echo     OK: HEAD.lock removido || echo     (nao existia)
if exist .git\refs\heads\main.lock del /f .git\refs\heads\main.lock && echo     OK: main.lock removido || echo     (nao existia)
echo.

echo [2/4] A adicionar todos os ficheiros...
git add -A
echo     OK
echo.

echo [3/4] A fazer commit...
git commit -m "feat: risk alerts, rapports reais, roadmap 30/60/90, WhatsApp check-in"
echo.

echo [4/4] A fazer push para Vercel...
git push origin main
echo.

echo ============================================
echo  CONCLUIDO! Vercel vai deploying em 1-2min.
echo  https://atelier-nox-growth-system.vercel.app
echo ============================================
echo.
pause
