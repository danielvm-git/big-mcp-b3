import type { ServerConfig } from "../types/index.js";

interface BrapiResponse<T> {
  [key: string]: T;
}

export class BrapiService {
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(endpoint, this.config.brapiToken ? `https://brapi.dev/api` : "https://brapi.dev/api");
    
    // Adiciona token se disponível
    if (this.config.brapiToken) {
      url.searchParams.set("token", this.config.brapiToken);
    }

    // Adiciona parâmetros
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(this.config.requestTimeout),
    });

    if (!response.ok) {
      throw new Error(`Erro na API brapi: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getCotacao(ticker: string): Promise<any> {
    const data = await this.request<any>(`/quote/${ticker}`);
    return data.results?.[0] || null;
  }

  async getCotacoesLote(tickers: string[]): Promise<any[]> {
    const data = await this.request<any>(`/quote/${tickers.join(",")}`);
    return data.results || [];
  }

  async getHistorico(ticker: string, interval: string = "1d", range: string = "1mo"): Promise<any[]> {
    const data = await this.request<any>(`/quote/${ticker}`, {
      interval,
      range,
      fundamental: "false",
      dividends: "false",
    });
    return data.results?.[0]?.historicalDataPrice || [];
  }

  async getProventos(ticker: string): Promise<any[]> {
    const data = await this.request<any>(`/quote/${ticker}`, {
      dividends: "true",
      fundamental: "false",
    });
    return data.results?.[0]?.dividendsData?.cashDividends || [];
  }

  async getIndices(): Promise<any[]> {
    const data = await this.request<any>("/quote/^BVSP,^IFIX,^IDIV,^SMLL,^ICON,^IMAT,^UTIL,^FINA,^INDU");
    return data.results || [];
  }

  async getOpcoes(ticker: string): Promise<any> {
    const data = await this.request<any>(`/quote/${ticker}`, {
      option: "true",
    });
    return data.results?.[0]?.options || [];
  }
}
