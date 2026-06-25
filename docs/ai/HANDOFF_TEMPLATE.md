# HANDOFF_TEMPLATE.md — Atelier Nox Growth System
> Modelo de encerramento de missão. Copiar e preencher ao encerrar cada sessão.
> Activar via skill `atelier-nox-handoff` para preenchimento automático.

---

# HANDOFF — [NOME DA MISSÃO]

**Data:** YYYY-MM-DD
**Sessão:** [ID ou descrição]
**Gate:** [Gate actual]
**Quem:** Claude (Cowork, sandbox Linux)

---

## 1. Objectivo da missão
[O que foi pedido, em 1-2 frases.]

## 2. Escopo autorizado
[O que estava permitido fazer. Listar proibições explícitas se relevantes.]

## 3. Estado inicial (verificado no início)
[Git branch, HEAD, worktrees, modificações existentes — valores reais, não do histórico.]

## 4. Arquivos lidos
```
[lista de ficheiros lidos nesta sessão]
```

## 5. Arquivos alterados
```
[lista de ficheiros criados ou modificados, com tipo de alteração]
```

## 6. Comandos executados
```bash
[exactamente o que foi executado, com saída real ou exit code]
```

## 7. Resultados obtidos
[O que funcionou. O que não funcionou. Erros encontrados e resolução.]

## 8. Testes executados (com resultado real)
| Teste | Comando | Resultado | Exit code |
|---|---|---|---|
| [nome] | [comando] | [saída] | [0/1/N] |

## 9. Testes recomendados mas NÃO executados
[Listar com motivo: ambiente não disponível, fora do escopo, etc.]

## 10. Decisões tomadas nesta sessão
[Decisões de Claude dentro do escopo autorizado. Decisões de João se confirmadas.]

## 11. Riscos identificados
[O que pode correr mal. Dependências externas. Incertezas.]

## 12. Pendências
[O que ficou por fazer. O que precisa de acção de João.]

## 13. Estado Git ao encerrar
```
branch: [branch]
HEAD: [hash] [mensagem]
ahead/behind: [N ahead, N behind]
ficheiros modificados não commitados: [N]
```

## 14. Próximo passo recomendado
[Uma acção clara. Quem faz. Pré-condições.]

## 15. Acções que dependem de João
- [ ] [acção 1]
- [ ] [acção 2]

---

## Bloco para ChatGPT / Codex (copiar se necessário)

```
PROJECTO: Atelier Nox Growth System
STACK: Next.js App Router + TypeScript + Supabase + Vercel
GATE ACTUAL: [gate]
ESTADO: [resumo em 3 linhas]
FICHEIROS RELEVANTES: [lista]
PRÓXIMA ACÇÃO: [acção]
RESTRIÇÕES: Não commitar, não fazer deploy, não aplicar migrations sem aprovação de João.
```

---

## Validação mínima antes de encerrar
```bash
npm run lint         # exit 0 obrigatório
npm run build        # build limpo obrigatório
git status --short   # listar tudo não commitado
git diff --stat      # confirmar diff dentro do escopo
```
