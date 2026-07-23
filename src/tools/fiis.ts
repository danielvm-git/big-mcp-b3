import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { BrapiService } from "../services/brapi.js";
import type { CvmService } from "../services/cvm.js";

export function registerFiisTool(server: McpServer, cvm: CvmService, brapi: BrapiService) {
  server.tool(
    "fiis_lista",
    "Lista fundos imobiliários com filtros opcionais",
    {
      segmento: z.string().optional().describe("Segmento do FII (ex: shoppings, logística, lajes)"),
      limit: z.number().min(1).max(100).default(20).describe("Quantidade de FIIs a retornar"),
    },
    async ({ segmento, limit }) => {
      try {
        let fiis = await cvm.getFiis();
        
        if (segmento) {
          fiis = fiis.filter((f: any) => 
            f.DENOM_SOCIAL?.toLowerCase().includes(segmento.toLowerCase())
          );
        }

        const fiisLimitados = fiis.slice(0, limit);

        const texto = [
          `## Fundos Imobiliários`,
          "",
          segmento ? `**Segmento:** ${segmento}` : `**Todos os segmentos**`,
          `**Total encontrados:** ${fiis.length}`,
          "",
          `| CNPJ | Nome | Situação |`,
          `|------|------|----------|`,
          ...fiisLimitados.map((f: any) => 
            `| ${f.CNPJ_FUNDO || "N/A"} | ${f.DENOM_SOCIAL || "N/A"} | ${f.SIT || "N/A"} |`
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
            text: `❌ Erro ao listar FIIs: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );

  server.tool(
    "fii_detalhes",
    "Obtém detalhes de um fundo imobiliário específico",
    {
      ticker: z.string().describe("Ticker do FII (ex: HGLG11, XPML11, KNRI11)"),
    },
    async ({ ticker }) => {
      try {
        // Busca cotação via brapi
        const cotacao = await brapi.getCotacao(ticker.toUpperCase());
        
        if (!cotacao) {
          return {
            content: [{
              type: "text",
              text: `❌ FII ${ticker.toUpperCase()} não encontrado`,
            }],
          };
        }

        // Busca proventos
        const proventos = await brapi.getProventos(ticker.toUpperCase());
        const ultimoProvento = proventos[0];

        const texto = [
          `## ${cotacao.symbol} — ${cotacao.shortName}`,
          "",
          `### Cotação`,
          `**Preço:** R$ ${cotacao.regularMarketPrice.toFixed(2)}`,
          `**Variação:** ${cotacao.regularMarketChangePercent >= 0 ? "+" : ""}${cotacao.regularMarketChangePercent.toFixed(2)}%`,
          `**Volume:** ${(cotacao.regularMarketVolume / 1000000).toFixed(2)}M`,
          "",
          `### Último Provento`,
          ultimoProvento 
            ? `**Tipo:** ${ultimoProvento.type || "N/A"}\n**Valor:** R$ ${(ultimoProvento.rate || 0).toFixed(6)}\n**Pagamento:** ${ultimoProvento.paymentDate ? new Date(ultimoProvento.paymentDate).toLocaleDateString("pt-BR") : "N/A"}`
            : "*Sem proventos recentes*",
          "",
          `### Dados Básicos`,
          `**Tipo:** ${cotacao.quoteType || "FII"}`,
          `**Exchange:** ${cotacao.exchange || "SAO"}`,
          `**Moeda:** ${cotacao.currency || "BRL"}`,
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
            text: `❌ Erro ao buscar detalhes do FII: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
          }],
        };
      }
    }
  );
}
