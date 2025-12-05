export interface SearchResult {
  text?: string;
  structuredData?: MaterialItem[] | CompanyItem[];
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      };
    }>;
  };
}

export interface MaterialItem {
  produto: string;
  marca: string;
  preco_numerico: number;
  preco_texto: string;
  loja: string;
  link?: string;
  obs?: string;
}

export interface CompanyItem {
  nome: string;
  local: string;
  contacto: string;
  especialidade: string;
}

export interface Message {
  role: 'user' | 'model';
  content?: string;
  data?: MaterialItem[] | CompanyItem[];
  dataType?: 'text' | 'materiais' | 'empresas';
  sources?: Array<{
    title: string;
    url: string;
  }>;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type SearchCategory = 'solucoes' | 'materiais' | 'empresas';