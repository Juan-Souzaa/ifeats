jest.mock('../../services/pagamentoService', () => ({
  buscarPagamentoPorPedido: jest.fn(),
}));

import * as pagamentoService from '../../services/pagamentoService';
import { useClienteCheckoutConfirmacaoViewModel } from '../useClienteCheckoutConfirmacaoViewModel';
import { actAsync, renderHook } from './hookTestUtils';

describe('useClienteCheckoutConfirmacaoViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('marca pago quando status inicial e PAID', () => {
    const { result } = renderHook(() =>
      useClienteCheckoutConfirmacaoViewModel(99, 'PIX', 'PAID')
    );
    expect(result.current.isPaid).toBe(true);
    expect(result.current.isPix).toBe(true);
  });

  it('consulta pagamento no polling PIX', async () => {
    (pagamentoService.buscarPagamentoPorPedido as jest.Mock).mockResolvedValue({ status: 'PENDING' });
    renderHook(() => useClienteCheckoutConfirmacaoViewModel(42, 'PIX', 'PENDING'));
    await actAsync(async () => {
      await Promise.resolve();
    });
    expect(pagamentoService.buscarPagamentoPorPedido).toHaveBeenCalledWith(42);
  });
});
