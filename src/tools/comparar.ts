import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";
import type { CvmService } from "../services/cvm.js";

export function registerCompararTool(server: McpServer, brapi: BrapiService, cvm: CvmService) {
  server.tool(
    "comparar_ativos",
    "Compara múltiplos ativos lado a lado (cotação, variação, proventos)",
    {
      tickers: z.array(z.string()).min(2).max(10).describe("Lista de tickers para comparar (mínimo 2, máximo 10)"),
    },
    async ({ tickers }) => {
      try {
        const tickersUpper = tickers.map(t => t.toUpperCase());
        const cotacoes = await brapi.getCotacoesLote(tickersUpper);
        
        if (!cotacoes || cotacoes.length === 0) {
          return {
            content: [{
              type: "text",
              text: `❌ Nenhum ativo encontrado`,
            }],
          };
        }

        // Busca proventos para cada ativo
        const proventosPorAtivo: Record<string, any[]> = {};
        for (const ticker of tickersUpper) {
          try {
            const proventos = await brapi.getProventos(ticker);
            proventosPorAtivo[ticker] = proventos || [];
          } catch {
            proventosPorAtivo[ticker] = [];
          }
        }

        const texto = [
          `## Comparação de Ativos`,
          "",
          `| Ativo | Preço | Variação | Tipo | Volume |`,
          `|-------|-------|----------|------|--------|`,
          ...cotacoes.map((c: any) => {
            const variacao = c.regularMarketChangePercent >= 0 
              ? `📈 +${c.regularMarketChangePercent.toFixed(2)}%`
              : `📉 ${c.regularMarketChangePercent.toFixed(2)}%`;
            return `| ${c.symbol} | R$ ${c.regularMarketPrice.toFixed(2)} | ${variacao} | ${c.quoteType || "N/A"} | ${(c.regularMarketVolume / 1000000).toFixed(2)}M |`;
          }),
          "",
          `### Últimos Proventos`,
          `| Ativo | Tipo | Valor | Pagamento |`,
          `|-------|------|-------|-----------|`,
          ...tickersUpper.map(ticker => {
            const proventos = proventosPorAtivo[ticker];
            if (proventos.length === 0) {
              return `| ${ticker} | - | - | - |`;
            }
            const ultimo = proventos[0];
            return `| ${ticker} | ${ultimo.type || "N/A"} | R$ ${(ultimo.rate || 0).toFixed(6)} | ${ultimo.paymentDate ? new Date(ultimo.paymentDate).toLocaleDateString("pt-BR") : "N/A"} |`;
          }),
          "",
          `*Atualizado: ${new Date().toLocaleString("pt-BR")}*`,
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
            text: `❌ Erro ao comparar ativos: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
