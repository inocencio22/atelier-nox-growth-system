# CLAUDE.md — Atelier Nox Growth System
> Instruções específicas para Claude. Regras partilhadas entre agentes → `AGENTS.md`.

## Leituras obrigatórias ao iniciar qualquer missão
1. `AGENTS.md` — stack, roadmap, regras de segurança e aprovação
2. `docs/ai/CURRENT_STATE.md` — estado Git, Gate actual, bloqueios verificados
3. `docs/ai/GATES.md` — critérios de conclusão do Gate em curso
4. `docs/ai/DECISIONS.md` — decisões aprovadas por João
5. `SECURITY_CHECKLIST.md` — obrigatório antes de tocar em Auth, RLS ou produção

## Leituras condicionais (ler apenas se relevante para a tarefa)
- Copy comercial aprovada → `docs/ai/APPROVED_COPY.md`
- Ambientes e ferramentas → `docs/ai/TOOLING_AND_ENVIRONMENTS.md`
- Encerrar missão → activar skill `atelier-nox-handoff`

## Regras obrigatórias do Claude
- **Verificar antes de afirmar.** Ler o estado actual. Nunca tratar hipótese como facto.
- **Escopo mínimo.** Fazer o menor diff possível. Não ampliar sem aprovação de João.
- **Distinguir sempre:** migration criada ≠ aplicada | teste recomendado ≠ executado.
- **Não revelar secrets.** Nunca ler, copiar ou revelar `.env.local` ou arquivos `.local`.
- **Não instalar** dependências sem aprovação explícita de João.
- **Não fazer** commit, push, deploy, migration remota sem aprovação explícita.
- **Não executar** `git reset`, `git clean`, `checkout`, `stash` sem autorização.
- **Não executar scripts de deploy locais** (DEPLOY.bat ou similares) — contêm listas hardcoded e push directo para produção.
- **Nunca apagar locks Git** (`HEAD.lock`, `index.lock`, etc.) — diagnosticar a causa primeiro.
- **Nunca manipular refs, commits ou objectos Git directamente** (Python plumbing, escrita manual de ficheiros em `.git/`).
- **Alterações de segurança ou infra** → criar branch e worktree isolados; nunca alterar directamente o working tree principal.
- **Proteger isolamento** admin / cliente / visitante em cada alteração.
- **Não avançar Gates** sem aprovação explícita de João.

## Formato de entrega de missão
Antes de qualquer acção importante, apresentar:
1. O que foi entendido
2. Estado encontrado (verificado agora, não do histórico)
3. Arquivos envolvidos
4. Riscos
5. Plano proposto
6. Critérios de validação
7. Decisão necessária de João

Relatório final inclui: ficheiros alterados | testes executados vs. apenas recomendados |
evidências reais | estado Git | próximo passo autorizado.
Parar e aguardar João após qualquer entrega.

## Ambiente de execução
Claude corre num sandbox Linux sem acesso a Docker, Supabase local ou PowerShell.
Operações que dependem do Windows → criar script `.bat` ou `.ps1` + instruir João.
Detalhes completos → `docs/ai/TOOLING_AND_ENVIRONMENTS.md`.

## Arquivos que NUNCA devem ser alterados sem aprovação explícita de João
`next.config.ts` | `.env*` | `supabase/migrations/*` | quaisquer ficheiros de Auth/RLS |
textos públicos aprovados (ver `docs/ai/APPROVED_COPY.md`) | configuração Vercel

## URL de produção
https://atelier-nox-growth-system.vercel.app/
