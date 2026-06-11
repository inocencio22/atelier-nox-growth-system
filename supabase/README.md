# Supabase - operacao real

Este diretorio prepara o Atelier Nox Growth System para sair do modo demo e operar com contas reais.

## Objetivo

- Criar login real por email e senha.
- Separar acesso admin e cliente.
- Guardar negocios, contatos, acoes, conteudos, diagnosticos e propostas no banco.
- Manter RLS ativa para que cada cliente veja apenas o proprio negocio.

## Arquivos principais

- `migrations/`: migrations em ordem.
- `production.sql`: bundle unico gerado para colar no SQL Editor do Supabase.
- `admin-bootstrap.sql`: template para promover o primeiro usuario admin.

## 1. Criar projeto Supabase

1. Acesse Supabase.
2. Crie um projeto novo para Atelier Nox.
3. Escolha uma regiao europeia.
4. Guarde:
   - Project URL
   - anon public key

## 2. Aplicar banco

Gere o arquivo unico:

```bash
npm run supabase:bundle
```

Depois abra `supabase/production.sql`, copie tudo e cole em:

```text
Supabase > SQL Editor > New query
```

Execute uma vez.

## 3. Configurar Auth

Em Supabase:

```text
Authentication > Providers > Email
```

Ative email/password.

Depois configure:

```text
Authentication > URL Configuration
```

Site URL:

```text
https://atelier-nox-growth-system.vercel.app
```

Redirect URLs:

```text
https://atelier-nox-growth-system.vercel.app/**
http://localhost:3000/**
```

## 4. Criar admin

1. Va em `Authentication > Users`.
2. Crie o usuario admin com seu email.
3. Rode `admin-bootstrap.sql` trocando `SEU_EMAIL_ADMIN@EXEMPLO.CH` pelo seu email real.

Resultado esperado:

```text
role = admin
```

## 5. Configurar Vercel

Adicione em:

```text
Vercel > Project > Settings > Environment Variables
```

Variaveis:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://atelier-nox-growth-system.vercel.app
ACCESS_GATE_PASSWORD=
```

Depois redeploy em production.

## 6. Teste minimo

1. Acesse `/login`.
2. Entre com email/senha do admin.
3. Abra `/infra`.
4. Verifique se Supabase URL e anon key aparecem configurados.
5. Abra `/demandes`.
6. Preencha `/diagnostic-gratuit` como visitante.
7. Veja se a demande aparece no admin.

## 7. Criar cliente

1. Crie o usuario do cliente em Supabase Auth.
2. Confirme que o perfil foi criado em `public.profiles`.
3. Deixe `role = client`.
4. Crie ou atualize o business com `owner_id` igual ao `id` do profile.

O cliente deve conseguir acessar:

- `/portal`
- `/portal/abonnement`
- `/contenus`
- `/actions`
- `/rapports`

Se tentar acessar area admin, deve voltar para `/portal`.
