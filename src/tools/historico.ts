import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";

export function registerHistoricoTool(server: McpServer, brapi: BrapiService) {
  server.tool(
    "historico_ativo",
    "Obtém histórico de preços de um ativo da B3",
    {
      ticker: z.string().describe("Ticker do ativo (ex: PETR4, HGLG11)"),
      periodo: z.enum(["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"])
        .default("1mo")
        .describe("Período do histórico"),
      intervalo: z.enum(["1d", "1wk", "1mo"])
        .default("1d")
        .describe("Intervalo entre pontos"),
    },
    async ({ ticker, periodo, intervalo }) => {
      try {
        const historico = await brapi.getHistorico(ticker.toUpperCase(), intervalo, periodo);
        
        if (!historico || historico.length === 0) {
          return {
            content: [{
              type: "text",
              text: `❌ Histórico não encontrado para ${ticker.toUpperCase()}`,
            }],
          };
        }

        const primeiro = historico[0];
        const ultimo = historico[historico.length - 1];
        const variacaoTotal = ((ultimo.close - primeiro.close) / primeiro.close * 100).toFixed(2);
        const maiorPreco = Math.max(...historico.map((h: any) => h.high));
        const menorPreco = Math.min(...historico.map((h: any) => h.low));
        const volumeTotal = historico.reduce((acc: number, h: any) => acc + h.volume, 0);

        const texto = [
          `## Histórico de ${ticker.toUpperCase()}`,
          "",
          `**Período:** ${periodo} | **Intervalo:** ${intervalo}`,
          `**Pontos:** ${historico.length}`,
          "",
          `### Resumo`,
          `**Primeiro:** R$ ${primeiro.close.toFixed(2)} (${new Date(primeiro.date).toLocaleDateString("pt-BR")})`,
          `**Último:** R$ ${ultimo.close.toFixed(2)} (${new Date(ultimo.date).toLocaleDateString("pt-BR")})`,
          `**Variação:** ${variacaoTotal}%`,
          `**Maior:** R$ ${maiorPreco.toFixed(2)}`,
          `**Menor:** R$ ${menorPreco.toFixed(2)}`,
          `**Volume Total:** ${(volumeTotal / 1000000).toFixed(2)}M`,
          "",
          `### Últimos 5 registros`,
          `| Data | Abertura | Máxima | Mínima | Fechamento | Volume |`,
          `|------|----------|--------|--------|------------|--------|`,
          ...historico.slice(-5).map((h: any) => 
            `| ${new Date(h.date).toLocaleDateString("pt-BR")} | R$ ${h.open.toFixed(2)} | R$ ${h.high.toFixed(2)} | R$ ${h.low.toFixed(2)} | R$ ${h.close.toFixed(2)} | ${(h.volume / 1000).toFixed(0)}K |`
          ),
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
            text: `❌ Erro ao buscar histórico: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
