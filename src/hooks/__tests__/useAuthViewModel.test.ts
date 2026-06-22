jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/authService', () => ({
  login: jest.fn(),
}));

import { act } from 'react-test-renderer';
import * as authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAuthViewModel } from '../useAuthViewModel';
import { actAsync, renderHook } from './hookTestUtils';

const setToken = jest.fn();

describe('useAuthViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ setToken });
  });

  it('faz login com sucesso', async () => {
    (authService.login as jest.Mock).mockResolvedValue('jwt-abc');
    const { result } = renderHook(() => useAuthViewModel());

    act(() => {
      result.current.setEmail('user@test.com');
      result.current.setPassword('123456');
    });

    await actAsync(async () => {
      await result.current.login();
    });

    expect(authService.login).toHaveBeenCalledWith('user@test.com', '123456');
    expect(setToken).toHaveBeenCalledWith('jwt-abc');
    expect(result.current.error).toBeNull();
  });

  it('define erro quando login falha', async () => {
    (authService.login as jest.Mock).mockRejectedValue({
      response: { data: 'Credenciais invalidas' },
    });
    const { result } = renderHook(() => useAuthViewModel());

    await actAsync(async () => {
      try {
        await result.current.login();
      } catch {
        /* esperado */
      }
    });

    expect(result.current.error).toBe('Credenciais invalidas');
  });
});
