import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Nota: fundamentus.com.br não tem API oficial
// Esta é uma implementação simplificada que pode precisar de scraping real
export function registerFundamentusTool(server: McpServer) {
  server.tool(
    "fundamentus_ativo",
    "Obtém fundamentos de uma ação (P/L, P/VP, ROE, margens, etc.) via fundamentus.com.br",
    {
      ticker: z.string().describe("Ticker da ação (ex: PETR4, VALE3, ITUB4)"),
    },
    async ({ ticker }) => {
      try {
        // Por enquanto, retorna instrução de como acessar
        // Em produção, faria scraping do fundamentus.com.br
        const url = `https://www.fundamentus.com.br/detalhes.php?papel=${ticker.toUpperCase()}`;
        
        const texto = [
          `## Fundamentos de ${ticker.toUpperCase()}`,
          "",
          `⚠️ **Nota:** O fundamentus.com.br não possui API oficial.`,
          `Para dados completos, acesse: ${url}`,
          "",
          `### Dados disponíveis via scraping (implementação futura):`,
          `- P/L (Preço/Lucro)`,
          `- P/VP (Preço/Valor Patrimonial)`,
          `- PSR (Preço/Receita)`,
          `- Dividend Yield`,
          `- ROE (Return on Equity)`,
          `- ROA (Return on Assets)`,
          `- ROIC`,
          `- Margem Bruta`,
          `- Margem EBITDA`,
          `- Margem Líquida`,
          `- Dívida Líquida/EBITDA`,
          `- Liquidez Corrente`,
          `- Receita 12m`,
          `- Lucro 12m`,
          "",
          `### Alternativas para dados fundamentalistas:`,
          `1. **brapi.dev** — dados básicos via API`,
          `2. **StatusInvest** — dados detalhados (scraping)`,
          `3. **Yahoo Finance** — dados internacionais`,
          `4. **CVM** — dados oficiais (DFPs)`,
        ].join("\n");

        return {
          content: [{
            type: "text",
            text: texto,
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `❌ Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
