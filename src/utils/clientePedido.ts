import type { ClienteResponseDTO, PedidoResponseDTO } from '../types/api';

export function labelClientePedido(
  pedido: PedidoResponseDTO,
  cliente?: ClienteResponseDTO | null
): string {
  const nome = cliente?.nome ?? pedido.clienteNome ?? undefined;
  const telefone = cliente?.telefone ?? pedido.clienteTelefone ?? undefined;
  if (nome && telefone) return `${nome} · ${telefone}`;
  if (nome) return nome;
  return `#${pedido.clienteId}`;
}
