export type ViaCepApiResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export async function consultarCep(cepRaw: string): Promise<ViaCepApiResponse | null> {
  const digits = cepRaw.replace(/\D/g, '');
  if (digits.length !== 8) return null;

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) {
    throw new Error('Falha na rede ao consultar CEP');
  }

  const data = (await res.json()) as ViaCepApiResponse;
  if (data.erro === true) {
    return null;
  }
  return data;
}
