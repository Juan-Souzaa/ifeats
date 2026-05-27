  switch (metodo) {
    case 'PIX':
      return 'PIX';
    case 'CASH':
      return 'Dinheiro';
    case 'CREDIT_CARD':
      return 'Cartão de crédito';
    default:
      return metodo;
  }
}
export function formatStatusPagamento(status: StatusPagamento): string {
    case 'PENDING':
      return 'Pendente';
    case 'AUTHORIZED':
      return 'Autorizado';
    case 'PAID':
      return 'Pago';
    case 'CANCELED':
      return 'Cancelado';
    case 'REFUSED':
      return 'Recusado';
    case 'REFUNDED':
      return 'Reembolsado';
    default:
      return status;
  }
}
export function resumoItensPedido(
  itens: { quantidade: number; pratoNome: string }[] | undefined,
