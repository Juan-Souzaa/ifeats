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
