@echo off
cd /d "C:\Users\Joao Pedro Vilar\Documents\MARKETING"

echo === Limpando locks git ===
if exist .git\HEAD.lock del /f .git\HEAD.lock
if exist .git\refs\heads\main.lock del /f .git\refs\heads\main.lock
if exist .git\index.lock del /f .git\index.lock

echo === Adicionando todos os ficheiros pendentes ===
git add lib\invoice-actions.ts
git add lib\business-actions.ts
git add lib\onboarding-actions.ts
git add "app\clients\[id]\page.tsx"
git add supabase\migrations\010_create_invoices.sql
git add supabase\migrations\011_add_contract_signed.sql
git add public\contrat-atelier-nox-template.pdf
git add lib\audit-actions.ts
git add app\audit\page.tsx
git add components\AppShell.tsx
git add CLAUDE.md DEPLOY.bat

echo === Commit ===
git commit -m "feat: facturas, contrato PDF, IBAN, fix RLS, pagina audit Google Business"

echo === Push para main ===
git push origin main

echo === Feito! Vercel deploy em 1-2 minutos ===
pause
