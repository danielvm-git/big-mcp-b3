import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";

export function registerProventosTool(server: McpServer, brapi: BrapiService) {
  server.tool(
    "proventos_ativo",
    "Obtém histórico de proventos (dividendos, JCP, bonificações) de um ativo",
    {
      ticker: z.string().describe("Ticker do ativo (ex: PETR4, TAEE11, HGLG11)"),
      limit: z.number().min(1).max(100).default(20).describe("Quantidade de proventos a retornar"),
    },
    async ({ ticker, limit }) => {
      try {
        const proventos = await brapi.getProventos(ticker.toUpperCase());
        
        if (!proventos || proventos.length === 0) {
          return {
            content: [{
              type: "text",
              text: `❌ Nenhum provento encontrado para ${ticker.toUpperCase()}`,
            }],
          };
        }

        const proventosLimitados = proventos.slice(0, limit);
        const totalRecebido = proventos.reduce((acc: number, p: any) => acc + (p.rate || 0), 0);
        const ultimoProvento = proventos[0];

        const texto = [
          `## Proventos de ${ticker.toUpperCase()}`,
          "",
          `**Total de proventos:** ${proventos.length}`,
          `**Último provento:** R$ ${ultimoProvento.rate?.toFixed(6) || "N/A"} (${ultimoProvento.type || "N/A"})`,
          `**Data pagamento:** ${ultimoProvento.paymentDate ? new Date(ultimoProvento.paymentDate).toLocaleDateString("pt-BR") : "N/A"}`,
          "",
          `### Últimos ${proventosLimitados.length} proventos`,
          `| Data Pagamento | Tipo | Valor (R$) | Data Com |`,
          `|----------------|------|------------|----------|`,
          ...proventosLimitados.map((p: any) => 
            `| ${p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("pt-BR") : "N/A"} | ${p.type || "N/A"} | ${(p.rate || 0).toFixed(6)} | ${p.lastDatePrior ? new Date(p.lastDatePrior).toLocaleDateString("pt-BR") : "N/A"} |`
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
            text: `❌ Erro ao buscar proventos: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
