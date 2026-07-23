export interface ServerConfig {
  brapiToken?: string;
  brapiBaseUrl: string;
  cvmBaseUrl: string;
  requestTimeout: number;
  maxRetries: number;
}

export interface Ativo {
  symbol: string;
  name: string;
  type: "acao" | "fii" | "bdr" | "etf" | "cripto";
}

export interface Cotacao {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  currency: string;
  timestamp: string;
}

export interface Historico {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface Provento {
  ticker: string;
  type: string; // "DIVIDENDO", "JCP", "BONIFICACAO", etc.
  value: number;
  paymentDate: string;
  recordDate: string;
  announcementDate: string;
  currency: string;
}

export interface FII {
  cnpj: string;
  nome: string;
  ticker: string;
  patrimonioLiquido: number;
  valorPatrimonialCota: number;
  taxaAdministracao: number;
  taxaGestao: number;
  dividendYield: number;
  vacancia: number;
  cotistas: number;
  segmento: string;
  gestor: string;
}

export interface Fundamento {
  ticker: string;
  nome: string;
  setor: string;
  preco: number;
  pl: number;
  pvp: number;
  psr: number;
  dividendYield: number;
  roe: number;
  roa: number;
  roic: number;
  margemBruta: number;
  margemEbitda: number;
  margemLiquida: number;
  dividaLiquidaEbitda: number;
  liquidezCorrente: number;
  receita12m: number;
  lucro12m: number;
  receita3m: number;
  lucro3m: number;
}

export interface Indice {
  symbol: string;
  name: string;
  points: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface Opcao {
  symbol: string;
  type: "call" | "put";
  strike: number;
  expiry: string;
  premium: number;
  volume: number;
  openInterest: number;
  inTheMoney: boolean;
  lastTradeDate: string;
}

export interface ComparacaoAtivo {
  ticker: string;
  preco: number;
  variacao: number;
  dividendYield: number;
  pl: number;
  pvp: number;
  roe: number;
  margemLiquida: number;
}
