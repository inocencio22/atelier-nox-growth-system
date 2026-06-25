# AGENTS.md — Atelier Nox Growth System
> Base partilhada entre Claude, ChatGPT, Codex e agentes futuros.
> Contém apenas regras estáveis. Estado actual em `docs/ai/CURRENT_STATE.md`.

## Identidade do projecto
Atelier Nox Growth System é um webapp + portal para vender e entregar um serviço mensal
gerido de crescimento local para PME da Suisse romande. Não é um SaaS genérico:
João vende acompanhamento, execução, clareza, acções comerciais, conteúdos, relances,
Google Business, aprovações e relatórios.

**Posicionamento aprovado:**
> Un service humain et géré de croissance locale pour les PME de Suisse romande.

**Nichos iniciais:** salões de coiffure (Lausanne), tatoueurs, restaurants/bars.
Copy completa aprovada → `docs/ai/APPROVED_COPY.md`.

## Stack principal
- Next.js App Router + TypeScript 5 + React 19 + Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, migrations versionadas (`supabase/migrations/`)
- Vercel em produção | GitHub como origem do código
- Playwright para E2E | Prettier + ESLint | Zod para validação

## Princípio estratégico
> "A IA qualifica. João aprova. O sistema converte."

A IA deve aparecer como apoio interno, nunca como protagonista da oferta pública.

## Regra de aprovação de João
João mantém aprovação final sobre:
- commits, push, merge, deploy, migrations em produção
- alterações em Auth, RLS, schema, middleware
- novas dependências npm
- acções destrutivas (reset, clean, stash, checkout destrutivo)
- alterações em preços, textos comerciais e posicionamento público

## Ordem estratégica do roadmap
1. Finalizar CRM e fluxo comercial de demandes (Gate B1)
2. Convite, activação, profiles, portal e acessos (Gate B2)
3. Chatbot estruturado no site (Gate C1)
4. IA para qualificação, resumo e handoff humano (Gate C2)
5. Integração WhatsApp Cloud API (Gate D)
6. Replicação para outros negócios locais (Gate E)

Detalhes e estado de cada Gate → `docs/ai/GATES.md`.

## Segurança — regras permanentes
- **Arquivos sensíveis — nunca abrir, imprimir, modificar, adicionar ao Git, copiar para documentação ou expor em logs:**
  `.env.local` | `.env.e2e.local` | `.supabase-admin.local` | `.supabase-client-test.local` | `.supabase-db-password.local` | qualquer `*.local` com credenciais | tokens | chaves | passwords | service role keys.
- Nunca commitar tokens, passwords, service role key, arquivos `.local`.
- `NEXT_PUBLIC_*` pode ser público; service role key nunca vai ao frontend.
- RLS deve estar activo em todas as tabelas com dados de cliente.
- Cliente vê apenas dados do seu próprio `businesses.owner_id`.
- Admin requer role `admin` verificado em cada rota protegida.
- Visitante anónimo em rota protegida → redirect `/login`.
- Se credencial aparecer em print ou conversa → revogar imediatamente.
- Nunca usar `using (true)` em tabela sensível após fase demo.
- Nunca aplicar migration remota sem autorização explícita de João.
- Preservar isolamento total: admin / cliente / visitante.
- Ler `SECURITY_CHECKLIST.md` antes de tocar em Auth, RLS, Vercel ou formulários.

## Regras de produto
- O cliente paga pelo serviço gerido, não para trabalhar dentro de uma ferramenta.
- O portal cliente deve mostrar resultado, clareza, aprovações e próximas acções.
- O admin deve permitir operar clientes com rapidez e qualidade.
- Toda funcionalidade deve responder: isso ajuda João a vender, entregar ou provar valor?

## Regras de Git e produção
- Nunca fazer commit/push/deploy sem autorização explícita de João.
- Nunca executar `git reset`, `git clean`, `checkout`, `stash` sem autorização.
- Nunca executar scripts de deploy locais (DEPLOY.bat ou similares): usam listas hardcoded e push directo para `main`.
- Nunca apagar locks Git (`HEAD.lock`, `index.lock`, etc.) automaticamente.
- Nunca manipular refs, commits ou objectos internos do Git com scripts manuais (Python plumbing, escrita directa em `.git/`).
- Alterações de segurança ou infra: criar branch e worktree isolados; commit separado; aguardar merge por João.
- Antes de qualquer commit: `git status --short` + `git diff --stat`.
- Migrations numeradas sequencialmente; **criada ≠ aplicada** — distinguir sempre.
- Local antes de remoto: testar localmente antes de qualquer operação em cloud.
- Produção (Vercel) só muda após commit + push para `main` aprovado por João.

## Idioma de trabalho
- Comunicação com João → português claro e directo.
- Interface visível para clientes → francês profissional.
- Comentários técnicos → português ou inglês técnico.

## Comandos confirmados
```bash
npm run dev             # desenvolvimento l