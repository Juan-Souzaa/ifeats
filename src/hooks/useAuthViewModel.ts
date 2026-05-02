import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

export function useAuthViewModel() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const jwt = await authService.login(email.trim(), password);
      await setToken(jwt);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? String((e as { response?: { data?: unknown } }).response?.data ?? 'Falha no login')
          : 'Não foi possível entrar. Verifique e-mail e senha.';
      setError(typeof msg === 'string' ? msg : 'Falha no login');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [email, password, setToken]);

  const logout = useCallback(async () => {
    await setToken(null);
  }, [setToken]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    login,
    logout,
  };
}
