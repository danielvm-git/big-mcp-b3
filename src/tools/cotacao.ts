import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";

export function registerCotacaoTool(server: McpServer, brapi: BrapiService) {
  server.tool(
    "cotacao_ativo",
    "Obtém cotação em tempo real de um ativo da B3 (ação, FII, BDR, ETF)",
    {
      ticker: z.string().describe("Ticker do ativo (ex: PETR4, HGLG11, AAPL34)"),
    },
    async ({ ticker }) => {
      try {
        const cotacao = await brapi.getCotacao(ticker.toUpperCase());
        
        if (!cotacao) {
          return {
            content: [{
              type: "text",
              text: `❌ Ativo ${ticker.toUpperCase()} não encontrado`,
            }],
          };
        }

        const variacao = cotacao.regularMarketChangePercent >= 0 
          ? `📈 +${cotacao.regularMarketChangePercent.toFixed(2)}%`
          : `📉 ${cotacao.regularMarketChangePercent.toFixed(2)}%`;

        const texto = [
          `## ${cotacao.symbol} — ${cotacao.shortName}`,
          "",
          `**Preço:** R$ ${cotacao.regularMarketPrice.toFixed(2)}`,
          `**Variação:** ${variacao}`,
          `**Abertura:** R$ ${cotacao.regularMarketOpen.toFixed(2)}`,
          `**Mínima:** R$ ${cotacao.regularMarketDayLow.toFixed(2)}`,
          `**Máxima:** R$ ${cotacao.regularMarketDayHigh.toFixed(2)}`,
          `**Volume:** ${(cotacao.regularMarketVolume / 1000000).toFixed(2)}M`,
          `**Market Cap:** R$ ${(cotacao.marketCap / 1000000000).toFixed(2)}B`,
          "",
          `*Atualizado: ${new Date(cotacao.regularMarketTime * 1000).toLocaleString("pt-BR")}*`,
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
            text: `❌ Erro ao buscar cotação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
