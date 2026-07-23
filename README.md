# 🇧🇷 big-mcp-b3

**MCP Server completo para dados da B3** — cotações, FIIs, proventos, fundamentos, opções e índices.

[![npm version](https://img.shields.io/npm/v/big-mcp-b3.svg)](https://www.npmjs.com/package/big-mcp-b3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-compatible-purple.svg)](https://modelcontextprotocol.io)

## ✨ Features

- **10 tools** para dados do mercado financeiro brasileiro
- **Sem chave de API obrigatória** — funciona imediatamente com brapi.dev (gratuita)
- **TypeScript moderno** — tipagem forte, async/await
- **Zero dependências pesadas** — apenas MCP SDK + Zod
- **Compatível** com Claude Desktop, Cursor, VS Code, Hermes

## 🛠️ Tools Disponíveis

| Tool | Descrição | API |
|------|-----------|-----|
| `cotacao_ativo` | Cotação em tempo real | brapi.dev |
| `historico_ativo` | Histórico de preços | brapi.dev |
| `proventos_ativo` | Dividendos, JCP, bonificações | brapi.dev |
| `fiis_lista` | Lista de fundos imobiliários | CVM + brapi.dev |
| `fii_detalhes` | Detalhes de um FII específico | brapi.dev |
| `fundamentus_ativo` | Fundamentalismo (P/L, ROE, margens) | fundamentus.com.br |
| `indices_b3` | Ibovespa, IFIX, IDIV, SMLL, etc. | brapi.dev |
| `opcoes_ativo` | Cadeia de opções (calls e puts) | brapi.dev |
| `comparar_ativos` | Compara múltiplos ativos lado a lado | brapi.dev |

## 🚀 Quick Start

### Claude Desktop

Adicione ao `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "big-mcp-b3": {
      "command": "npx",
      "args": ["-y", "big-mcp-b3"],
      "env": {
        "BRAPI_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### Cursor

Adicione ao `.cursor/mcp.json`:

```json
{
  "servers": {
    "big-mcp-b3": {
      "command": "npx",
      "args": ["-y", "big-mcp-b3"],
      "env": {
        "BRAPI_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### VS Code

Crie `.vscode/mcp.json`:

```json
{
  "servers": {
    "big-mcp-b3": {
      "command": "npx",
      "args": ["-y", "big-mcp-b3"],
      "env": {
        "BRAPI_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### Hermes

```bash
hermes mcp add big-mcp-b3 -- npx -y big-mcp-b3
```

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/danielvm-git/big-mcp-b3.git
cd big-mcp-b3

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📖 Exemplos de Uso

Após configurar o MCP server, faça perguntas em linguagem natural:

> **Cotação:** "Qual a cotação atual de PETR4?"

> **Histórico:** "Mostre o histórico de VALE3 nos últimos 3 meses"

> **Proventos:** "Quais foram os dividendos pagos por TAEE11?"

> **FIIs:** "Liste os FIIs de shoppings"

> **Índices:** "Como está o Ibovespa hoje?"

> **Opções:** "Quais são as opções de PETR4 com vencimento em 2026?"

> **Comparação:** "Compare PETR4 com VALE3 e ITUB4"

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|------------|-----------|
| `BRAPI_TOKEN` | Não | Token da brapi.dev (gratuito, 100 req/dia) |
| `REQUEST_TIMEOUT` | Não | Timeout das requisições em ms (padrão: 30000) |
| `MAX_RETRIES` | Não | Número máximo de retentativas (padrão: 3) |

### Obtendo Token da brapi.dev

1. Acesse [brapi.dev](https://brapi.dev)
2. Crie uma conta gratuita
3. Copie seu token do dashboard
4. Adicione ao `.env` ou na configuração do MCP

**Nota:** O server funciona sem token (com limite de requisições).

## 📊 Dados Disponíveis

### Ações
- Cotação em tempo real
- Histórico de preços (1d a 10y)
- Dividendos e JCP
- Opções (calls e puts)

### Fundos Imobiliários
- Lista completa via CVM
- Cotação e variação
- Proventos pagos

### Índices
- Ibovespa (^BVSP)
- IFIX (^IFIX)
- IDIV (^IDIV)
- SMLL (^SMLL)
- E mais...

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
big-mcp-b3/
├── src/
│   ├── index.ts          # Entry point
│   ├── types/            # Definições de tipos
│   ├── services/         # Serviços de API
│   │   ├── brapi.ts      # brapi.dev
│   │   └── cvm.ts        # CVM dados abertos
│   └── tools/            # Tools MCP
│       ├── cotacao.ts    # Cotação
│       ├── historico.ts  # Histórico
│       ├── proventos.ts  # Proventos
│       ├── fiis.ts       # FIIs
│       ├── fundamentus.ts# Fundamentos
│       ├── indices.ts    # Índices
│       ├── opcoes.ts     # Opções
│       └── comparar.ts   # Comparação
├── tests/
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

### Comandos

```bash
npm run dev      # Executa em modo desenvolvimento
npm run build    # Compila TypeScript
npm run start    # Executa versão compilada
npm test         # Executa testes
```

## 📝 Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

## 📧 Contato

- GitHub: [@danielvm-git](https://github.com/danielvm-git)
- Issues: [GitHub Issues](https://github.com/danielvm-git/big-mcp-b3/issues)

---

**Feito com ❤️ para investidores brasileiros**
