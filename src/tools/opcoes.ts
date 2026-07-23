import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";

export function registerOpcoesTool(server: McpServer, brapi: BrapiService) {
  server.tool(
    "opcoes_ativo",
    "Obtém cadeia de opções de um ativo (calls e puts)",
    {
      ticker: z.string().describe("Ticker do ativo underlying (ex: PETR4, VALE3)"),
      tipo: z.enum(["call", "put", "todas"]).default("todas").describe("Tipo de opção"),
    },
    async ({ ticker, tipo }) => {
      try {
        const opcoes = await brapi.getOpcoes(ticker.toUpperCase());
        
        if (!opcoes || opcoes.length === 0) {
          return {
            content: [{
              type: "text",
              text: `❌ Nenhuma opção encontrada para ${ticker.toUpperCase()}`,
            }],
          };
        }

        let opcoesFiltradas = opcoes;
        if (tipo === "call") {
          opcoesFiltradas = opcoes.filter((o: any) => o.type === "call");
        } else if (tipo === "put") {
          opcoesFiltradas = opcoes.filter((o: any) => o.type === "put");
        }

        // Agrupa por vencimento
        const porVencimento: Record<string, any[]> = {};
        opcoesFiltradas.forEach((o: any) => {
          const venc = o.expirationDate || "Sem vencimento";
          if (!porVencimento[venc]) {
            porVencimento[venc] = [];
          }
          porVencimento[venc].push(o);
        });

        const texto = [
          `## Opções de ${ticker.toUpperCase()}`,
          "",
          `**Total de opções:** ${opcoesFiltradas.length}`,
          `**Filtro:** ${tipo}`,
          "",
          ...Object.entries(porVencimento).slice(0, 3).map(([venc, ops]) => [
            `### Vencimento: ${venc}`,
            `| Strike | Tipo | Prêmio | Volume | ITM |`,
            `|--------|------|--------|--------|-----|`,
            ...ops.slice(0, 10).map((o: any) => 
              `| R$ ${(o.strike || 0).toFixed(2)} | ${o.type?.toUpperCase() || "N/A"} | R$ ${(o.lastPrice || 0).toFixed(2)} | ${o.volume || 0} | ${o.inTheMoney ? "✅" : "❌"} |`
            ),
            "",
          ]).flat(),
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
            text: `❌ Erro ao buscar opções: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
