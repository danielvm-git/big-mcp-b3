#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Services
import { BrapiService } from "./services/brapi.js";
import { CvmService } from "./services/cvm.js";

// Tools
import { registerCotacaoTool } from "./tools/cotacao.js";
import { registerHistoricoTool } from "./tools/historico.js";
import { registerProventosTool } from "./tools/proventos.js";
import { registerFiisTool } from "./tools/fiis.js";
import { registerFundamentusTool } from "./tools/fundamentus.js";
import { registerIndicesTool } from "./tools/indices.js";
import { registerOpcoesTool } from "./tools/opcoes.js";
import { registerCompararTool } from "./tools/comparar.js";

// Types
import type { ServerConfig } from "./types/index.js";

// Configuração
const config: ServerConfig = {
  brapiToken: process.env.BRAPI_TOKEN,
  brapiBaseUrl: process.env.BRAPI_BASE_URL || "https://brapi.dev/api",
  cvmBaseUrl: process.env.CVM_BASE_URL || "https://dados.cvm.gov.br",
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "30000", 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || "3", 10),
};

// Inicializa serviços
const brapi = new BrapiService(config);
const cvm = new CvmService(config);

// Cria servidor MCP
const server = new McpServer({
  name: "big-mcp-b3",
  version: "1.0.0",
});

// Registra tools
registerCotacaoTool(server, brapi);
registerHistoricoTool(server, brapi);
registerProventosTool(server, brapi);
registerFiisTool(server, cvm, brapi);
registerFundamentusTool(server);
registerIndicesTool(server, brapi);
registerOpcoesTool(server, brapi);
registerCompararTool(server, brapi, cvm);

// Inicia servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 big-mcp-b3 server iniciado");
}

main().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
