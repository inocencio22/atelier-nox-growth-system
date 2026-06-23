# TOOLING_AND_ENVIRONMENTS.md — Atelier Nox Growth System
> Documentação dos dois ambientes: Windows (João) e sandbox Linux (Claude).
> Ler antes de qualquer tarefa que envolva execução de comandos.

---

## Ambiente A — Windows (João Pedro)

**Sistema:** Windows 11 (presumido) com PowerShell e CMD
**Pasta do projecto:** `C:\Users\Joao Pedro Vilar\Documents\MARKETING\`
**Worktree Gate B1.1:** `C:\Users\Joao Pedro Vilar\Documents\MARKETING\worktrees\gate-b1\`

### Ferramentas disponíveis no Windows
| Ferramenta | Estado | Notas |
|---|---|---|
| Node.js / npm | ✅ activo | Node v22.22.3, npm 10.9.8 |
| Git | ✅ activo | v2.34.1 |
| Supabase CLI | ✅ activo | Windows PATH — não disponível em sandbox |
| Docker Desktop | ⚠️ estado desconhecido nesta sessão | Necessário para Supabase local |
| Supabase local | ⚠️ estado desconhecido nesta sessão | Corre via Docker |
| PowerShell | ✅ activo | Usado para scripts `.ps1` |
| Playwright (browsers) | ✅ activo | v1.60.0, inclui Chromium |
| Chrome (browser real) | ✅ activo | Claude-in-Chrome MCP disponível |
| psql | ✅ activo | Via Docker exec no container Supabase |

### O que João executa directamente
- Scripts `.bat` e `.ps1` criados por Claude
- `npm run dev` / `npm run build` / `npm run lint`
- `supabase db push` (após aprovação explícita)
- `git commit` / `git push` (após aprovação explícita)
- Testes Playwright (`npm run test:e2e`)
- Queries SQL via `docker exec` ao container Supabase local

---

## Ambiente B — Sandbox Linux (Claude)

**Sistema:** Ubuntu 22, isolado, sem persistência entre sessões
**Path de montagem MARKETING:** `/sessions/epic-focused-hamilton/mnt/MARKETING/`
**Path de outputs:** `/sessions/epic-focused-hamilton/mnt/outputs/`

### Ferramentas disponíveis no sandbox
| Ferramenta | Estado | Notas |
|---|---|---|
| Node.js / npm | ✅ activo | Node v22.22.3 |
| Git | ✅ activo | v2.34.1 |
| Python 3 | ✅ activo | Para scripts auxiliares |
| ESLint / Prettier | ✅ activo | Via npx no MARKETING/ |
| TypeScript (tsc) | ✅ activo | Via npx |
| Claude Code | ✅ activo | v2.1.181 |
| Playwright | ✅ instalado | Mas sem browser headless no sandbox |
| Supabase CLI | ❌ não disponível | Não está no PATH do sandbox |
| Docker | ❌ não disponível | Container Windows, não acessível |
| PowerShell | ❌ não disponível | Linux — usar bash |
| psql directo | ❌ não disponível | Requer Docker Windows |

### O que Claude executa directamente no sandbox
- Leitura e escrita de ficheiros em MARKETING/
- `npm run lint` / `npm run build` / `npm run format:check`
- `npx tsc --noEmit`
- `git status` / `git log` / `git diff` (só leitura)
- Scripts Node.js (`node scripts/*.mjs`)
- Criação de ficheiros `.bat` e `.ps1` para João executar

### O que Claude NÃO pode executar (depende de João)
- `supabase db push` / `supabase db reset`
- `npm run test:e2e` (requer Supabase local + Next.js local activos)
- `npm run dev` (seria no sandbox, não no Windows onde está o .env.local)
- Qualquer `docker exec` ao Supabase local
- `git commit` / `git push` / `git merge`
- Queries SQL ao Supabase local

---

## Padrão de trabalho actual: bat-file intermediário

```
Claude cria script .bat ou .ps1
       ↓
João executa no Windows
       ↓
Script gera log (ex: b11-quality.log)
       ↓
Claude lê o log e analisa
```

**Vantagem:** funciona sem MCPs adicionais
**Limitação:** latência — requer João disponível para executar

---

## Risco crítico: confundir local com produção

| Risco | Mitigação |
|---|---|
| `supabase db push` aplicar em produção | Usar `--local` ou confirmar com João o target |
| `.env.local` apontar para Supabase cloud | Playwright usa `.env.e2e.local` (guard no config) |
| Next.js dev ligar ao Supabase cloud | Verificar `NEXT_PUBLIC_SUPABASE_URL` antes de qualquer teste |
| Migration aplicada em produção sem teste local | Regra: local → validação → produção, sempre |

---

## Supabase local — configuração Docker

**Container:** `supabase_db_atelier-nox-growth-system`
**Portas locais:**
- API: 54321
- DB (PostgreSQL): 54322
- Studio: 54323
- Auth: 54329

**Não expor:** passwords, tokens, chaves de acesso do `.env.local` ou `.supabase-admin.local`
