import type { ServerConfig, FII } from "../types/index.js";

export class CvmService {
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.config.cvmBaseUrl);

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "big-mcp-b3/1.0.0",
      },
      signal: AbortSignal.timeout(this.config.requestTimeout),
    });

    if (!response.ok) {
      throw new Error(`Erro na API CVM: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getFiis(): Promise<any[]> {
    // Endpoint: https://dados.cvm.gov.br/dados/FI/CAD/DADOS/inf_cadastral_fi.csv
    // Por simplicidade, vamos usar a API de fundos
    const data = await this.request<any>("/dados/FI/CAD/DADOS/inf_cadastral_fi.json");
    return data || [];
  }

  async getFiiDetalhes(cnpj: string): Promise<any> {
    // Busca detalhes de um FII específico
    const fiis = await this.getFiis();
    return fiis.find((f: any) => f.CNPJ_FUNDO === cnpj) || null;
  }

  async getFiisPorSegmento(segmento: string): Promise<any[]> {
    const fiis = await this.getFiis();
    return fiis.filter((f: any) => 
      f.DENOM_SOCIAL?.toLowerCase().includes(segmento.toLowerCase()) ||
      f.SIT?.toLowerCase().includes(segmento.toLowerCase())
    );
  }

  async getProventosFiis(): Promise<any[]> {
    // Endpoint para proventos de FIIs
    const data = await this.request<any>("/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi.json");
    return data || [];
  }
}
