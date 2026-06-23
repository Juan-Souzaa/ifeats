jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(() => cb(), [cb]);
    },
  };
});

jest.mock('../../services/adminService', () => ({
  listarHistoricoTaxas: jest.fn(),
  criarConfiguracaoTaxa: jest.fn(),
}));

import * as adminService from '../../services/adminService';
import { useAdminTaxasViewModel } from '../useAdminTaxasViewModel';
import { actAsync, renderHook } from './hookTestUtils';
import { act } from 'react-test-renderer';

describe('useAdminTaxasViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (adminService.listarHistoricoTaxas as jest.Mock).mockResolvedValue([
      { id: 1, tipoTaxa: 'TAXA_RESTAURANTE', percentual: 10, ativo: true },
    ]);
  });

  it('carrega historico de taxas', async () => {
    const { result } = renderHook(() => useAdminTaxasViewModel());
    await actAsync(async () => {
      await Promise.resolve();
    });
    expect(adminService.listarHistoricoTaxas).toHaveBeenCalledWith('TAXA_RESTAURANTE');
    expect(result.current.historico).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });

  it('cria nova configuracao de taxa', async () => {
    (adminService.criarConfiguracaoTaxa as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useAdminTaxasViewModel());

    act(() => {
      result.current.setPercentual('12,5');
    });

    await actAsync(async () => {
      await result.current.criar();
    });

    expect(adminService.criarConfiguracaoTaxa).toHaveBeenCalledWith({
      tipoTaxa: 'TAXA_RESTAURANTE',
      percentual: 12.5,
    });
  });
});
