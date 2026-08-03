# Release Plan — big-mcp-b3

**Versão:** 1.0.0  
**Status:** Em desenvolvimento  
**Última atualização:** 2026-07-23  

---

## Visão Geral

MCP Server para dados da B3 — cotações, FIIs, proventos, fundamentos, opções e índices.  
Objetivo: publicar no npm como ferramenta open-source para investidores brasileiros.

---

## Epic 1: Testing & Quality Foundation
**Prioridade:** P1 | **Valor:** Alto | **Esfuerzo:** M | **WSJF:** 5.0

> Garantir que o código funciona e é manutenível antes de publicar.

### Story 1.1: Configurar testes unitários com Vitest
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Testes unitários
  Scenario: Testes passam sem erros
    Given o projeto está configurado com Vitest
    When executo `npm test`
    Then todos os testes passam com sucesso
    And a cobertura mínima é de 70%

  Scenario: Testes cobrem as tools principais
    Given as tools cotacao_ativo, historico_ativo, proventos_ativo
    When executo os testes unitários
    Then cada tool tem pelo menos 2 cenários testados (happy path + erro)
```

**Tasks:**
- [ ] Configurar Vitest no projeto → verify: `cat vitest.config.ts | grep -q "defineConfig"`
- [ ] Criar mocks para BrapiService → verify: `ls src/__mocks__/ | grep brapi`
- [ ] Testar tool cotacao_ativo (success + error) → verify: `npm test -- --reporter=verbose src/tools/cotacao.test.ts | grep -q "PASS"`
- [ ] Testar tool historico_ativo → verify: `npm test -- --reporter=verbose src/tools/historico.test.ts | grep -q "PASS"`
- [ ] Testar tool proventos_ativo → verify: `npm test -- --reporter=verbose src/tools/proventos.test.ts | grep -q "PASS"`
- [ ] Testar tool comparar_ativos → verify: `npm test -- --reporter=verbose src/tools/comparar.test.ts | grep -q "PASS"`
- [ ] Configurar cobertura mínima 70% → verify: `npm test -- --coverage | grep -q "70%"`

---

### Story 1.2: Configurar linting e type checking
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Qualidade de código
  Scenario: ESLint não reporta erros
    Given o projeto com configuração ESLint
    When executo `npm run lint`
    Then não há erros de lint
    And warnings são documentados ou corrigidos

  Scenario: TypeScript compila sem erros
    Given o projeto TypeScript
    When executo `npx tsc --noEmit`
    Then não há erros de tipagem
```

**Tasks:**
- [ ] Configurar ESLint com TypeScript → verify: `cat .eslintrc.json | grep -q "@typescript-eslint"`
- [ ] Adicionar script lint ao package.json → verify: `cat package.json | grep -q '"lint"'`
- [ ] Corrigir erros de lint existentes → verify: `npm run lint 2>&1 | grep -q "0 errors"`
- [ ] Adicionar typecheck script → verify: `cat package.json | grep -q '"typecheck"'`

---

## Epic 2: Implementar Fundamentus Tool
**Prioridade:** P1 | **Valor:** Alto | **Esfuerzo:** L | **WSJF:** 4.0

> A tool fundamentus_ativo é um placeholder — precisa de implementação real.

### Story 2.1: Implementar scraping do fundamentus.com.br
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Fundamentus scraping
  Scenario: Buscar fundamentos de uma ação
    Given a tool fundamentus_ativo
    When chamo com ticker "PETR4"
    Then recebo dados reais: P/L, P/VP, ROE, DY, margens
    And os dados são formatados em texto legível

  Scenario: Tratar erro de ativo inexistente
    Given a tool fundamentus_ativo
    When chamo com ticker "INVALIDO99"
    Then recebo mensagem de erro amigável
    And o servidor não crasha
```

**Tasks:**
- [ ] Instalar cheerio para parsing HTML → verify: `cat package.json | grep -q "cheerio"`
- [ ] Implementar BrapiService.getFundamentos() → verify: `grep -q "getFundamentos" src/services/brapi.ts`
- [ ] Atualizar tool fundamentus_ativo para usar dados reais → verify: `grep -q "await brapi.getFundamentos" src/tools/fundamentus.ts`
- [ ] Adicionar testes para fundamentos → verify: `npm test -- src/tools/fundamentus.test.ts | grep -q "PASS"`
- [ ] Testar com múltiplos tickers (PETR4, VALE3, ITUB4) → verify: `npm test -- --grep "fundamentus" | grep -q "3 passed"`

---

### Story 2.2: Adicionar dados fundamentalistas via CVM (DFPs)
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Dados CVM para fundamentalismo
  Scenario: Buscar DFPs de uma empresa
    Given o CvmService
    When busco demonstrações financeiras de "PETR4"
    Then recebo dados oficiais da CVM
    And inclui balanço patrimonial e DRE

  Scenario: Cache de dados CVM
    Given dados CVM já buscados
    When faço a mesma requisição novamente
    Then os dados vêm do cache (não da API)
    And o cache expira após 24h
```

**Tasks:**
- [ ] Implementar CvmService.getDFPs() → verify: `grep -q "getDFPs" src/services/cvm.ts`
- [ ] Adicionar cache com TTL de 24h → verify: `grep -q "cache" src/services/cvm.ts`
- [ ] Integrar com tool fundamentus_ativo → verify: `grep -q "cvm.getDFPs" src/tools/fundamentus.ts`
- [ ] Testar cenários de cache → verify: `npm test -- --grep "cache" | grep -q "PASS"`

---

## Epic 3: Publish & CI/CD
**Prioridade:** P2 | **Valor:** Alto | **Esfuerzo:** S | **WSJF:** 3.5

> Publicar o pacote no npm e configurar CI para qualidade contínua.

### Story 3.1: Preparar pacote para npm
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: NPM publish
  Scenario: Pacote publicável
    Given o projeto buildado
    When executo `npm pack`
    Then gera um tarball válido com dist/, package.json, README
    And o tarball tem menos de 100KB

  Scenario: Publicar no npm
    Given o pacote preparado
    When executo `npm publish`
    Then o pacote aparece em npmjs.com/package/big-mcp-b3
    And `npx big-mcp-b3 --version` retorna a versão
```

**Tasks:**
- [ ] Configurar files no package.json → verify: `cat package.json | grep -A5 '"files"'`
- [ ] Adicionar prepublishOnly script → verify: `cat package.json | grep -q "prepublishOnly"`
- [ ] Testar npm localmente → verify: `npm pack 2>&1 | grep -q "big-mcp-b3-*.tgz"`
- [ ] Configurar .npmignore → verify: `test -f .npmignore && echo "OK"`
- [ ] Publicar versão 1.0.0 → verify: `npm view big-mcp-b3 version | grep -q "1.0.0"`

---

### Story 3.2: Configurar GitHub Actions CI
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: CI pipeline
  Scenario: CI roda em cada push
    Given configuração GitHub Actions
    When faço push para main
    Then o workflow executa: lint, test, build
    And o status aparece no PR

  Scenario: CI falha em erro de lint
    Given código com erro de lint
    When faço push
    Then o CI falha
    And o erro é reportado no log
```

**Tasks:**
- [ ] Criar .github/workflows/ci.yml → verify: `test -f .github/workflows/ci.yml && echo "OK"`
- [ ] Configurar matrix Node 18/20 → verify: `grep -q "node-version: \\[18, 20\\]" .github/workflows/ci.yml`
- [ ] Adicionar steps: install, lint, test, build → verify: `grep -q "npm run lint" .github/workflows/ci.yml`
- [ ] Adicionar publish workflow (on tag) → verify: `test -f .github/workflows/publish.yml && echo "OK"`

---

## Epic 4: Features Avançadas
**Prioridade:** P2 | **Valor:** Médio | **Esfuerzo:** L | **WSJF:** 2.5

> Novas funcionalidades para diferenciar o projeto.

### Story 4.1: Adicionar watchlist com alertas
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Watchlist
  Scenario: Adicionar ativo à watchlist
    Given uma watchlist vazia
    When adiciono "PETR4" com alerta de preço R$ 30.00
    Then o ativo aparece na watchlist
    And o alerta está configurado

  Scenario: Receber alerta de preço
    Given "PETR4" na watchlist com alerta R$ 30.00
    When o preço atinge R$ 29.95
    Then recebo notificação via MCP
```

**Tasks:**
- [ ] Criar tool watchlist_adicionar → verify: `grep -q "watchlist_adicionar" src/tools/watchlist.ts`
- [ ] Criar tool watchlist_listar → verify: `grep -q "watchlist_listar" src/tools/watchlist.ts`
- [ ] Implementar sistema de alertas → verify: `grep -q "alertas" src/services/alertas.ts`
- [ ] Persistir watchlist em arquivo local → verify: `grep -q "watchlist.json" src/services/storage.ts`

---

### Story 4.2: Adicionar tool para carteira de investimentos
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Carteira
  Scenario: Registrar compra de ativo
    Given uma carteira vazia
    When registro compra de 100 PETR4 a R$ 28.50
    Then a posição aparece na carteira
    And o custo total é R$ 2.850,00

  Scenario: Calcular lucro/prejuízo
    Given posição de 100 PETR4 a R$ 28.50
    When o preço atual é R$ 32.00
    Then o lucro é R$ 350,00 (+12.28%)
```

**Tasks:**
- [ ] Criar tool carteira_registrar → verify: `grep -q "carteira_registrar" src/tools/carteira.ts`
- [ ] Criar tool carteira_posicoes → verify: `grep -q "carteira_posicoes" src/tools/carteira.ts`
- [ ] Calcular P&L em tempo real → verify: `grep -q "calcularPL" src/services/carteira.ts`
- [ ] Persistir dados em JSON local → verify: `grep -q "carteira.json" src/services/storage.ts`

---

### Story 4.3: Adicionar screener de ativos
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Screener
  Scenario: Filtrar ações por DY
    Given o screener de ativos
    When filtro por DY > 6% e P/L < 15
    Then recebo lista de ativos que atendem critérios
    And inclui dados fundamentalistas básicos

  Scenario: Filtrar FIIs por segmento
    Given o screener de FIIs
    When filtro por segmento "Shoppings"
    Then recebo lista de FIIs de shoppings
    And inclui cotação e DY
```

**Tasks:**
- [ ] Criar tool screener_acoes → verify: `grep -q "screener_acoes" src/tools/screener.ts`
- [ ] Criar tool screener_fiis → verify: `grep -q "screener_fiis" src/tools/screener.ts`
- [ ] Integrar com BrapiService para dados em lote → verify: `grep -q "getCotacoesLote" src/tools/screener.ts`
- [ ] Adicionar testes → verify: `npm test -- src/tools/screener.test.ts | grep -q "PASS"`

---

## Epic 5: Documentação & Marketing
**Prioridade:** P3 | **Valor:** Médio | **Esfuerzo:** S | **WSJF:** 2.0

> Documentar o projeto para adoção da comunidade.

### Story 5.1: Criar documentação completa
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Documentação
  Scenario: README completo
    Given o README.md
    When um desenvolvedor lê
    Then entende: o que é, como instalar, como usar, como contribuir
    And tem exemplos de uso real

  Scenario: Documentação de API
    Given as tools disponíveis
    When acesso /docs/api.md
    Then cada tool tem: descrição, parâmetros, exemplo de uso, exemplos de resposta
```

**Tasks:**
- [ ] Atualizar README com exemplos reais → verify: `grep -q "```json" README.md`
- [ ] Criar docs/API.md → verify: `test -f docs/API.md && echo "OK"`
- [ ] Criar docs/CONTRIBUTING.md → verify: `test -f CONTRIBUTING.md && echo "OK"`
- [ ] Adicionar badges npm, CI, coverage → verify: `grep -q "img.shields.io" README.md`

---

### Story 5.2: Criar vídeo de demonstração e blog post
**Status:** [ ] Not started

**Acceptance Criteria:**
```
Feature: Marketing
  Scenario: Vídeo de demonstração
    Given o projeto funcional
    When gravo vídeo mostrando uso no Claude Desktop
    Then o vídeo mostra: instalação, configuração, 3 exemplos de uso
    And duração < 5 minutos

  Scenario: Blog post
    Given o projeto publicado
    When escrevo post "Como usar MCP pra monitorar investimentos"
    Then inclui: contexto, código, exemplos, link para npm
```

**Tasks:**
- [ ] Gravar vídeo de demonstração → verify: `test -f docs/demo.mp4 && echo "OK"`
- [ ] Escrever blog post → verify: `test -f docs/blog-post.md && echo "OK"`
- [ ] Publicar no YouTube → verify: URL do vídeo
- [ ] Publicar no Medium/dev.to → verify: URL do post

---

## Resumo de Prioridades

| Epic | Prioridade | Valor | Esfuerzo | WSJF | Status |
|------|------------|-------|----------|------|--------|
| 1. Testing & Quality | P1 | Alto | M | 5.0 | Not started |
| 2. Fundamentus Tool | P1 | Alto | L | 4.0 | Not started |
| 3. Publish & CI/CD | P2 | Alto | S | 3.5 | Not started |
| 4. Features Avançadas | P2 | Médio | L | 2.5 | Not started |
| 5. Documentação | P3 | Médio | S | 2.0 | Not started |

---

## Próximos Passos Recomendados

1. **Iniciar Epic 1** — Testing & Quality Foundation
   - Executar `plan-work` para detalhar tasks
   - Começar com Story 1.1 (testes unitários)

2. **Paralelamente:** Story 1.2 (linting/typecheck)

3. **Depois:** Epic 2 (Fundamentus) — depende de testes

4. **Antes de publicar:** Epic 3 (CI/CD)

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila TypeScript
npm test             # Executa testes
npm run lint         # Verifica linting

# Publicação
npm run prepublish   # Build + test antes de publicar
npm publish          # Publica no npm

# CI/CD
gh pr create         # Cria PR para review
gh workflow run ci   # Dispara CI manualmente
```

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| brapi.dev rate limit | Alto | Implementar cache agressivo |
| fundamentus.com.br muda HTML | Médio | Usar cheerio com seletores robustos |
| CVM API instável | Baixo | Fallback para brapi.dev |
| Concorrência (outros MCPs B3) | Médio | Foco em UX e documentação |

---

## Notas

- **WSJF** = (Business Value + Time Criticality + Risk Reduction) / Job Size
- **Prioridade:** P1 (essencial), P2 (importante), P3 (nice-to-have)
- **Esfuerzo:** S (1-2 dias), M (3-5 dias), L (1+ semana)
