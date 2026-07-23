import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";

export function registerIndicesTool(server: McpServer, brapi: BrapiService) {
  server.tool(
    "indices_b3",
    "Obtém cotações dos principais índices da B3 (Ibovespa, IFIX, IDIV, SMLL, etc.)",
    {
      indices: z.array(z.enum(["IBOV", "IFIX", "IDIV", "SMLL", "ICON", "IMAT", "UTIL", "FINA", "INDU"]))
        .default(["IBOV", "IFIX"])
        .describe("Lista de índices para consultar"),
    },
    async ({ indices }) => {
      try {
        const cotacoes = await brapi.getIndices();
        
        if (!cotacoes || cotacoes.length === 0) {
          return {
            content: [{
              type: "text",
              text: `❌ Não foi possível obter cotações dos índices`,
            }],
          };
        }

        const indicesMap: Record<string, string> = {
          "IBOV": "^BVSP",
          "IFIX": "^IFIX",
          "IDIV": "^IDIV",
          "SMLL": "^SMLL",
          "ICON": "^ICON",
          "IMAT": "^IMAT",
          "UTIL": "^UTIL",
          "FINA": "^FINA",
          "INDU": "^INDU",
        };

        const indicesFiltrados = cotacoes.filter((c: any) => {
          const ticker = c.symbol;
          return indices.some(idx => indicesMap[idx] === ticker);
        });

        const texto = [
          `## Índices da B3`,
          "",
          `| Índice | Pontos | Variação |`,
          `|--------|--------|----------|`,
          ...indicesFiltrados.map((c: any) => {
            const variacao = c.regularMarketChangePercent >= 0 
              ? `📈 +${c.regularMarketChangePercent.toFixed(2)}%`
              : `📉 ${c.regularMarketChangePercent.toFixed(2)}%`;
            return `| ${c.shortName || c.symbol} | ${c.regularMarketPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} | ${variacao} |`;
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
            text: `❌ Erro ao buscar índices: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
