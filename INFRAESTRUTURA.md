# Infraestrutura de producao Atelier Nox

Este documento descreve a parte 1 do projeto: tirar o webapp do modo local/demo e preparar para operacao real com Supabase, Vercel e dominio.

## Objetivo

Ter o sistema acessivel online, com dados reais, contas separadas por cliente e uma base confiavel para vender o servico.

## Componentes

- Vercel: hospedagem do app Next.js.
- Supabase: Auth, banco Postgres, RLS e dados por cliente.
- Dominio: `ateliernox.ch` ou `joaopedro.chat`.
- Variaveis de ambiente: credenciais publicas do Supabase e URL publica do site.

## Deploy atual

O webapp ja esta publicado na Vercel:

```text
https://atelier-nox-growth-system.vercel.app
```

Este link serve para validacao interna, demos e revisao do produto. Antes de enviar para clientes reais, configurar as variaveis de ambiente de producao e o dominio final.

## Variaveis obrigatorias

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
ACCESS_GATE_PASSWORD=
```

Em local, `NEXT_PUBLIC_SITE_URL` pode ser `http://localhost:3000`.

Em producao, use o dominio final, por exemplo:

```bash
NEXT_PUBLIC_SITE_URL=https://ateliernox.ch
```

## Ordem de configuracao

1. Criar projeto no Supabase.
2. Copiar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Rodar as migrations em ordem:

```text
supabase/migrations/001_create_contacts.sql
supabase/migrations/002_create_businesses.sql
supabase/migrations/003_create_onboarding_submissions.sql
supabase/migrations/004_create_diagnostics_and_proposals.sql
supabase/migrations/005_create_commercial_actions.sql
supabase/migrations/006_create_content_items.sql
supabase/migrations/007_prepare_auth_profiles_roles.sql
```

4. Criar usuario admin no Supabase Auth.
5. Promover o usuario admin:

```sql
update public.profiles
set role = 'admin'
where email = 'SEU_EMAIL';
```

6. Importar o projeto na Vercel.
7. Adicionar as mesmas variaveis em Vercel > Project Settings > Environment Variables.
8. Configurar dominio na Vercel.
9. Configurar Supabase Auth URL:

- Site URL: dominio final.
- Redirect URLs: dominio final e `http://localhost:3000` para testes.

## Teste minimo antes de vender

- `/diagnostic-gratuit` salva uma demande.
- `/login` entra com usuario admin.
- `/clients` lista businesses reais.
- `/clients/[id]` abre ficha do cliente.
- A ficha cria action rapide e contenu rapide.
- Cliente com role `client` acessa `/portal` e nao acessa areas admin.

## Status dentro do app

A pagina `/infra` mostra quais variaveis estao configuradas e qual etapa ainda falta.

## Observacao importante

O access gate por codigo e apenas fallback de MVP. Para cliente real, usar Supabase Auth com usuario, senha e roles.

Em producao, o app nao aceita senha padrao. Se `ACCESS_GATE_PASSWORD` nao estiver configurado na Vercel, o acesso por codigo temporario fica desativado.
