# CLAUDE.md - Atelier Nox Growth System

## Objetivo deste handoff

Este arquivo existe para orientar o Claude/Claude Code ao assumir o projeto Atelier Nox Growth System.

O objetivo principal agora e continuar o projeto com seguranca, sem perder o contexto comercial, tecnico e visual que ja foi construido.

## Contexto comercial

Atelier Nox Growth System e um webapp + portal para vender e entregar um servico mensal gerido de crescimento local para PME da Suisse romande.

O projeto nao deve ser tratado como SaaS generico. A proposta e um servico gerido: Joao vende acompanhamento, execucao, clareza, acoes comerciais, conteudos, relances, Google Business, aprovacoes e relatorios.

Primeiro nicho: saloes de coiffure em Lausanne.

Posicionamento aprovado:

> Un service humain et gere de croissance locale pour les PME de Suisse romande.

Mensagem principal aprovada da home:

> Nous pilotons votre croissance locale, avec vous.

Texto de apoio aprovado:

> Atelier Nox accompagne les PME de Suisse romande avec un service humain, clair et mesurable : visibilite locale, contenus, relances, avis Google et suivi regulier.

Importante: IA deve aparecer como apoio interno, nao como protagonista da oferta.

## Stack tecnica

- Next.js App Router
- TypeScript
- React 19
- Tailwind CSS
- Supabase Auth, Postgres, RLS e migrations
- Vercel em producao
- GitHub como origem do codigo
- Playwright para testes e2e
- Prettier e ESLint
- Zod para validacao

Scripts principais:

```bash
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run format:check
npm run supabase:bundle
npm run supabase:types
```

## URL de producao

https://atelier-nox-growth-system.vercel.app/

## Rotas principais

Publicas:

- `/`
- `/services`
- `/abonnement`
- `/diagnostic-gratuit`
- `/login`

Admin:

- `/clients`
- `/demandes`
- `/actions`
- `/contenus`
- `/contacts`
- `/campagnes`
- `/messages`
- `/rapports`
- `/infra`
- `/business`
- `/instagram`

Cliente:

- `/portal`
- `/portal/abonnement`

## Estado comercial aprovado

Planos aprovados:

- Local Clarity - CHF 190/mois
- Managed Growth - CHF 390/mois
- Done For You Local - CHF 690/mois

Regra comercial aprovada:

Os forfaits mensuels cobrem acompanhamento, preparacao, gestao e suivi.
Budgets publicitarios, ferramentas externas, hosting, dominio, criacao avancada de site, shooting photo/video e setups tecnicos especificos sao cobrados separadamente.

Servicos oficiais aprovados:

1. Visibilite locale
2. Google Business & avis clients
3. Contenus locaux et humains
4. Relances clients & suivi commercial
5. Campagnes locales Meta & Google
6. Landing pages locales
7. Automatisation legere
8. Suivi regulier & portail client

## Regras criticas de seguranca

- Nao expor tokens, senhas, cookies, JWT, service role key, anon key privada ou credenciais.
- Nao commitar `.env.local` nem arquivos `.local`.
- Nao usar service role no frontend.
- Nao alterar RLS sem explicar o impacto.
- Cliente comum nao pode acessar admin.
- Visitante sem login deve ser redirecionado para `/login` em rotas protegidas.
- Admin e cliente usam a mesma tela `/login`, com redirecionamento por role.
- Se encontrar credenciais em print/conversa, recomendar revogacao.

Arquivos locais sensiveis que podem existir e nao devem ser expostos:

- `.env.local`
- `.supabase-admin.local`
- `.supabase-client-test.local`
- `.supabase-db-password.local`

## Supabase/RLS

Migrations ficam em:

```text
supabase/migrations
```

Ao alterar schema/policies:

```bash
npm run supabase:bundle
npm run supabase:types
```

Regras:

- Publico pode inserir demande em `onboarding_submissions` de forma controlada.
- Publico nao deve ler demandes.
- Admin pode ler/operar demandes.
- Cliente so deve ver dados ligados ao proprio business.

## Estado atual do Git no momento do handoff

Ultimo commit conhecido:

```text
5c1b3a4f feat: implement Atelier Nox brand assets and Lausanne hero
```

Ha alteracoes locais nao commitadas relacionadas a uma tentativa de ajuste visual do topo:

- `app/globals.css`
- `app/page.tsx`
- `components/AppShell.tsx`
- `components/BrandMark.tsx`
- `public/images/alpine-growth-hero.webp` (novo asset local)

Essas alteracoes NAO estao aprovadas definitivamente pelo Joao.

Tambem existem arquivos/pastas locais nao relacionados que devem continuar fora de commit salvo aprovacao explicita:

- `docs/`
- `scripts/create_project_summary_pdf.py`
- `scripts/create_project_summary_reportlab.py`
- `test-results/`

Antes de qualquer commit, rodar:

```bash
git status --short
git diff --stat
git diff --name-only
```

## Problema visual pendente

Joao quer que o topo da home se aproxime visualmente da referencia enviada por ele:

- header branco;
- logo horizontal com simbolo de montanha + texto "ATELIER NOX" + subtitulo "GROWTH SYSTEM";
- hero como composicao unica;
- texto compacto a esquerda;
- imagem de montanha integrada a direita;
- transicao suave do branco para a imagem;
- sem moldura/caixa em volta da imagem;
- montanha e bandeira visiveis;
- imagem deve comecar logo abaixo do header;
- fundo branco;
- menor altura do hero;
- menos espaco vazio;
- quatro selos na mesma linha no desktop.

Porem, Joao tambem deixou claro:

- nao alterar nenhuma palavra;
- nao alterar menu;
- nao alterar botoes;
- nao alterar secoes abaixo;
- nao alterar servicos, precos, cards, FAQ, formularios, admin, portal, Supabase, Auth ou RLS.

Textos que devem permanecer:

- `Nous pilotons votre croissance locale, avec vous.`
- paragrafo aprovado da home;
- selos: `100% local`, `Base a Lausanne`, `Service gere`, `Rapports clairs`;
- botoes: `Diagnostic offert` e `Voir nos services`.

Evitar voltar com:

- `L'IA qui transforme votre visibilite en clients.`
- `ATELIER NOX GROWTH SYSTEM` como eyebrow no hero;
- `pilote par l'IA`;
- `Voir le systeme`;
- linguagem de agencia generica de IA.

## Como validar antes de entregar

Rodar no minimo:

```bash
npm run lint
npm run build
npm run test:e2e
npm run format:check
```

Validar visualmente:

- `/` desktop
- `/` mobile
- `/services`
- `/abonnement`
- `/diagnostic-gratuit`
- `/login`

Validar comportamento:

- `/clients` sem login redireciona para `/login`;
- admin acessa `/demandes`;
- cliente acessa `/portal`;
- cliente comum nao acessa admin;
- formulario `/diagnostic-gratuit` salva demande real.

## Regras de trabalho para o Claude

1. Antes de mudar qualquer coisa, ler:
   - `AGENTS.md`
   - `SECURITY_CHECKLIST.md`
   - `CLAUDE.md`
   - `app/page.tsx`
   - `components/AppShell.tsx`
   - `components/BrandMark.tsx`
   - `lib/data.ts`

2. Fazer menor diff possivel.

3. Nao instalar dependencias sem aprovacao explicita.

4. Nao fazer commit/push sem aprovacao explicita.

5. Se for mexer no visual, capturar screenshot desktop/mobile antes de pedir aprovacao.

6. Se o pedido for sobre producao, lembrar que Vercel so muda depois de commit + push para `main`.

## Prompt recomendado para iniciar no Claude

Cole isto no Claude:

```text
Voce esta assumindo o projeto Atelier Nox Growth System.

Leia primeiro CLAUDE.md, AGENTS.md e SECURITY_CHECKLIST.md.

Nao altere Supabase, Auth, RLS, admin, portal, precos, servicos, FAQ ou formularios.

O problema atual e somente visual no topo da home.
Quero ajustar header/hero para parecer com a referencia: header branco, logo horizontal com montanha, texto compacto a esquerda, imagem de montanha integrada a direita, transicao suave, sem moldura, imagem comecando logo abaixo do header.

Nao altere nenhuma palavra.
Nao faca commit nem push sem minha aprovacao.

Primeiro, revise o estado atual com git status, git diff --stat e leia app/page.tsx, components/AppShell.tsx e components/BrandMark.tsx. Depois proponha o menor plano possivel.
```

