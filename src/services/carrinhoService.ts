import type {
  AplicarCupomRequestDTO,
  CarrinhoItemRequestDTO,
  CarrinhoResponseDTO,
} from '../types/api';
import { api } from './http';

export async function obterCarrinho(): Promise<CarrinhoResponseDTO> {
  const { data } = await api.get<CarrinhoResponseDTO>('/api/carrinho');
  return data;
}

export async function adicionarItem(dto: CarrinhoItemRequestDTO): Promise<CarrinhoResponseDTO> {
  const { data } = await api.post<CarrinhoResponseDTO>('/api/carrinho/itens', dto);
  return data;
}

export async function atualizarQuantidade(
  itemId: number,
  quantidade: number
): Promise<CarrinhoResponseDTO> {
  const { data } = await api.patch<CarrinhoResponseDTO>(
    `/api/carrinho/itens/${itemId}`,
    undefined,
    { params: { quantidade } }
  );
  return data;
}

export async function removerItem(itemId: number): Promise<CarrinhoResponseDTO> {
  const { data } = await api.delete<CarrinhoResponseDTO>(`/api/carrinho/itens/${itemId}`);
  return data;
}

export async function aplicarCupom(dto: AplicarCupomRequestDTO): Promise<CarrinhoResponseDTO> {
  const { data } = await api.post<CarrinhoResponseDTO>('/api/carrinho/cupom', dto);
  return data;
}

export async function removerCupom(): Promise<CarrinhoResponseDTO> {
  const { data } = await api.delete<CarrinhoResponseDTO>('/api/carrinho/cupom');
  return data;
}

export async function limparCarrinho(): Promise<void> {
  await api.delete('/api/carrinho');
}
