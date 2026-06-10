# Manual completo do Local Growth OS

Este manual explica o sentido do MVP **Local Growth OS** e como usar cada tela para validar vendas de serviços de IA + marketing para salões de coiffure em Lausanne.

## 1. O que é o Local Growth OS

O Local Growth OS é um painel operacional simples para ajudar João Pedro a vender antes de construir uma plataforma complexa.

Ele não é um CRM completo, não envia mensagens automaticamente e não integra APIs externas. A ideia é funcionar como um cockpit de validação comercial:

- mapear salões com potencial;
- entender quais leads merecem prioridade;
- gerar diagnósticos simulados em francês;
- preparar propostas comerciais;
- organizar mensagens de prospecção;
- acompanhar métricas mínimas de resposta e avanço.

Nesta fase, todos os dados são mockados. Ou seja, são exemplos falsos usados para validar a experiência, o raciocínio comercial e o fluxo de trabalho.

## 2. Para quem o app foi pensado

O primeiro nicho escolhido é:

- pequenos salões de coiffure;
- localizados em Lausanne e arredores;
- com presença digital imperfeita;
- que podem se beneficiar de IA, marketing local, mensagens melhores, Google Business, conteúdo e follow-up.

O usuário principal é João Pedro. O app não foi criado ainda para ser usado pelo cliente final. Ele serve como ferramenta interna de venda.

## 3. Lógica geral do fluxo

O fluxo pensado é:

1. João encontra salões em Lausanne.
2. João adiciona ou consulta esses salões como leads.
3. João avalia sinais simples: site, Instagram, bairro, score e oportunidades.
4. João gera um diagnóstico simulado em francês.
5. João usa o diagnóstico para abrir conversa com o salão.
6. João prepara uma proposta simples.
7. João acompanha respostas, propostas e próximos passos.

O objetivo é responder uma pergunta prática:

> Salões pequenos pagariam por ajuda de IA + marketing se João mostrar oportunidades claras e fáceis de entender?

## 4. Menu lateral

O menu lateral organiza as principais áreas do MVP.

- **Tableau**: visão geral do pipeline.
- **Leads**: lista de salões mapeados.
- **Diagnostic**: geração de diagnóstico simulado.
- **Propositions**: propostas comerciais em preparação ou enviadas.
- **Messages**: modelos de mensagens para prospecção manual.
- **Rapports**: métricas básicas para acompanhar validação.

No celular, esse menu fica na parte inferior da tela para facilitar o uso mobile-first.

## 5. Dashboard / Tableau de bord

A tela **Tableau de bord** é a visão principal.

Ela responde rapidamente:

- quantos leads existem;
- quantos diagnósticos estão prontos;
- quantas propostas estão em andamento;
- qual é a taxa de resposta;
- quais leads João deveria priorizar;
- qual proposta precisa de atenção.

### Métricas do topo

#### Leads qualifiés

Exemplo na tela: **24**

Significa a quantidade de salões que já foram minimamente qualificados. Um lead qualificado não é só um nome aleatório. É um salão que parece ter alguma oportunidade comercial.

Critérios possíveis:

- tem presença online;
- está em Lausanne ou região;
- tem sinais de demanda local;
- possui pontos claros de melhoria;
- pode pagar por serviços simples.

O texto **Lausanne et environs** indica o território geográfico.

O texto **+8 cette semaine** indica avanço recente. A função é mostrar se João está aumentando a base de prospecção.

#### Diagnostics prêts

Exemplo na tela: **7**

Significa quantos diagnósticos já estão preparados para serem usados em conversa comercial.

Um diagnóstico é uma análise simples em francês mostrando:

- pontos fortes do salão;
- riscos ou falhas visíveis;
- ações recomendadas;
- oportunidades de melhoria.

O texto **Dont 3 prioritaires** quer dizer que, dos 7 diagnósticos, 3 pertencem a leads mais importantes.

O texto **2 à envoyer** indica que ainda existem diagnósticos prontos que João deveria enviar ou usar em contato manual.

#### Propositions

Exemplo na tela: **4**

Significa quantas propostas comerciais estão em andamento.

O texto **CHF 5'800 pipeline** indica o valor comercial potencial somado dessas propostas. Não é dinheiro recebido ainda. É oportunidade aberta.

O texto **1 relance due** quer dizer que uma proposta precisa de follow-up.

#### Taux réponse

Exemplo na tela: **31%**

Significa a taxa de resposta das mensagens manuais enviadas.

Se João enviou 100 contatos e recebeu 31 respostas, a taxa é 31%.

Essa métrica é importante porque o MVP quer validar vendas. Se ninguém responde, talvez a mensagem, o nicho ou a oferta precisem mudar.

O texto **Messages manuels** reforça que não há automação de envio nesta fase.

O texto **+6 pts** indica melhora de 6 pontos percentuais.

## 6. Seção Leads prioritaires

Essa área mostra os salões que João deveria olhar primeiro.

Cada card de lead inclui:

- nome do salão;
- bairro;
- status;
- score;
- site;
- Instagram;
- observação comercial;
- oportunidades sugeridas.

### Exemplo: Atelier Coupe Lausanne

No card aparece:

- **Flon**: bairro ou zona.
- **Score 86/100**: prioridade relativa do lead.
- **Web atelier-coupe.ch**: site do salão.
- **IG @ateliercoupe_lsn**: Instagram do salão.
- **Bon avis Google, faible cadence de posts, réservation peu visible**: leitura comercial rápida.

Isso quer dizer:

> O salão parece ter reputação boa, mas comunica pouco e talvez perca clientes porque a reserva não está visível o bastante.

### Tags de oportunidade

Exemplos:

- **Optimiser fiche Google**
- **Assistant FAQ WhatsApp**

Essas tags são ideias de serviços que João poderia vender.

Elas não são ações automáticas. São pistas para a conversa comercial.

## 7. Status dos leads

Os status ajudam João a saber em que etapa cada salão está.

### Prioritaire

Lead com maior potencial. Deve ser contatado rápido.

Pode ter bom score, oportunidade clara ou maior chance de pagar.

### À contacter

Lead identificado, mas ainda sem conversa iniciada.

### Diagnostic

Lead já tem ou precisa de diagnóstico preparado.

### Proposition

Lead já avançou para oferta comercial.

### Gagné

Cliente fechado. O status existe no modelo, embora ainda não apareça como fluxo completo nesta fase.

## 8. Seção Prochaine proposition

No Dashboard aparece uma proposta em destaque.

Exemplo:

- **Pack Visibilité Locale**
- cliente: **Atelier Coupe Lausanne**
- status: **Brouillon**
- valor: **CHF 1'200**
- observação: **À finaliser**

O sentido dessa área é mostrar a próxima ação comercial que João deve finalizar.

### O que é Pack Visibilité Locale

É uma oferta simples, pensada para resolver problemas visíveis de presença local.

Pode incluir:

- otimização de Google Business;
- mini diagnóstico com IA;
- scripts de relance;
- mensagens para pedir avaliações;
- melhoria da clareza de reserva.

### O que significa Brouillon

Significa que a proposta ainda é rascunho.

João ainda precisa ajustar detalhes antes de enviar ou apresentar.

### O que significa Valeur proposée

É o preço sugerido da proposta.

Neste exemplo: **CHF 1'200**.

Não significa receita confirmada.

## 9. Página Leads

A página **Leads** mostra todos os salões mockados.

Ela serve para João comparar oportunidades e decidir:

- quem contactar primeiro;
- quem precisa de diagnóstico;
- quem já está em proposta;
- quais problemas aparecem com mais frequência.

Nesta versão, os dados ainda não podem ser editados pela interface. Eles ficam no arquivo `lib/data.ts`.

## 10. Página Nouveau diagnostic

A página **Diagnostic** é uma das partes centrais do MVP.

Ela simula a geração de um diagnóstico em francês para um salão.

O diagnóstico contém:

- salão selecionado;
- score local;
- status;
- resumo;
- forças;
- riscos;
- ações recomendadas.

### Para que serve o diagnóstico

O diagnóstico serve como ferramenta de venda consultiva.

Em vez de João mandar uma mensagem genérica como "faço marketing e IA", ele pode dizer:

> Analisei rapidamente sua presença local e encontrei 3 oportunidades concretas para transformar mais pesquisas em rendez-vous.

Isso torna a abordagem mais específica e menos parecida com spam.

### O botão Générer un diagnostic simulé

Hoje o botão é visual. Ele representa a ação futura de gerar ou atualizar o diagnóstico.

Nesta fase MVP, o diagnóstico é mockado. O objetivo é validar se a estrutura faz sentido antes de integrar IA real.

## 11. Página Propositions

A página **Propositions** mostra ofertas comerciais preparadas para leads.

Cada proposta inclui:

- nome do pacote;
- lead relacionado;
- status;
- resumo;
- valor proposto.

### Status das propostas

#### Brouillon

Ainda está em preparação.

#### Envoyée

Já foi enviada ou apresentada ao lead.

#### À valider

Precisa de revisão antes de envio ou fechamento.

### Por que propostas simples

O MVP evita propostas complexas porque o objetivo é vender rápido e aprender.

As primeiras ofertas devem ser fáceis de explicar:

- diagnóstico;
- visibilidade local;
- mensagens;
- conteúdo;
- follow-up;
- relatório simples.

## 12. Página Messages

A página **Messages** reúne modelos de mensagens em francês.

O objetivo é ajudar João a prospectar manualmente sem começar do zero toda vez.

Exemplos:

- primeiro contato;
- relance suave;
- mensagem após diagnóstico.

Importante: nesta fase, o app não envia nada sozinho.

João copia, adapta e envia manualmente por email, WhatsApp, Instagram ou LinkedIn.

## 13. Página Rapports

A página **Rapports** mostra métricas de validação.

Ela não é um relatório financeiro completo. É um painel simples para saber se a prospecção está funcionando.

Métricas atuais:

- contatos adicionados;
- diagnósticos gerados;
- mensagens preparadas;
- rendez-vous obtidos.

### Como interpretar

Se contatos sobem mas respostas não sobem, talvez a mensagem esteja ruim.

Se respostas sobem mas propostas não avançam, talvez a oferta esteja pouco clara.

Se propostas sobem mas fechamentos não acontecem, talvez preço, timing ou confiança precisem ajuste.

## 14. O que ainda não existe

Por decisão de MVP, o app ainda não tem:

- login;
- banco de dados;
- cadastro real de leads pela interface;
- integração com Google Maps;
- integração com Instagram;
- integração com WhatsApp;
- geração real via OpenAI;
- envio automático de mensagens;
- exportação PDF;
- pagamento;
- funil completo de CRM.

Essas ausências são intencionais. O foco agora é validar a venda.

## 15. Como João deve usar na prática

### Rotina diária sugerida

1. Abrir o Dashboard.
2. Ver os leads prioritários.
3. Escolher 3 salões para abordar.
4. Abrir Diagnostic para preparar a conversa.
5. Usar um template em Messages.
6. Registrar mentalmente ou na planilha externa quem respondeu.
7. Atualizar os dados mockados quando necessário.

### Rotina semanal sugerida

1. Revisar quantidade de leads qualificados.
2. Ver quantos diagnósticos foram gerados.
3. Ver quantas propostas estão em aberto.
4. Calcular taxa de resposta real.
5. Ajustar a oferta com base nas conversas.

## 16. Onde os dados estão no código

Os dados mockados ficam em:

```text
lib/data.ts
```

Ali estão:

- leads;
- métricas;
- propostas;
- templates de mensagens;
- dados de relatórios;
- itens de navegação.

O diagnóstico simulado fica em:

```text
lib/diagnostic.ts
```

## 17. Como transformar em produto real depois

Depois que João validar interesse real, os próximos passos naturais são:

1. Criar formulário para adicionar leads.
2. Salvar dados em banco simples.
3. Gerar diagnóstico com IA real.
4. Exportar diagnóstico ou proposta em PDF.
5. Criar histórico de contatos.
6. Criar lembretes de follow-up.
7. Integrar WhatsApp ou email apenas após validação.
8. Criar autenticação.

## 18. Resumo do sentido da tela do exemplo

A tela do print é o cockpit comercial.

Ela não quer ser bonita por ser bonita. Ela quer responder:

- Quantos salões eu tenho no radar?
- Quantos diagnósticos já posso usar para vender?
- Quantas propostas podem virar dinheiro?
- Minha prospecção está recebendo resposta?
- Qual salão devo priorizar agora?
- Qual proposta preciso finalizar?

O sentido principal é tirar João da improvisação e colocar a venda em um fluxo repetível.

