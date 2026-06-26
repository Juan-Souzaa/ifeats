export interface EnderecoRequestDTO {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal?: boolean;
}

export interface EnderecoResponseDTO {
  id: number;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number | null;
  longitude: number | null;
  principal: boolean | null;
  criadoEm: string;
}

export interface EnderecoCepResponseDTO {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}
