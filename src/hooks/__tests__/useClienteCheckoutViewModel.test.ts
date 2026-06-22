jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../services/clienteService', () => ({
  buscarMeuCliente: jest.fn(),
}));

jest.mock('../../services/enderecoService', () => ({
  listarEnderecosCliente: jest.fn(),
}));

jest.mock('../../services/pedidoService', () => ({
  criarPedido: jest.fn(),
}));

jest.mock('../../services/pagamentoService', () => ({
  criarPagamento: jest.fn(),
}));

import * as clienteService from '../../services/clienteService';
import * as enderecoService from '../../services/enderecoService';
import { useCart } from '../../context/CartContext';
import { useClienteCheckoutViewModel } from '../useClienteCheckoutViewModel';
import { actAsync, renderHook } from './hookTestUtils';

describe('useClienteCheckoutViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      carrinho: { id: 1, itens: [{ pratoId: 1, quantidade: 1 }], total: 25 },
      refresh: jest.fn().mockResolvedValue(undefined),
    });
    (clienteService.buscarMeuCliente as jest.Mock).mockResolvedValue({ id: 3 });
    (enderecoService.listarEnderecosCliente as jest.Mock).mockResolvedValue([
      { id: 5, principal: true, logradouro: 'Rua A' },
    ]);
  });

  it('carrega enderecos na inicializacao', async () => {
    const { result } = renderHook(() => useClienteCheckoutViewModel(1));
    await actAsync(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(enderecoService.listarEnderecosCliente).toHaveBeenCalledWith(3);
    expect(result.current.enderecos).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });
});
