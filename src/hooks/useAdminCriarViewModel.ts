import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as adminService from '../services/adminService';
import type { AdminResponseDTO } from '../types/api';

export function useAdminCriarViewModel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [admins, setAdmins] = useState<AdminResponseDTO[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const refreshAdmins = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const list = await adminService.listarAdmins();
      setAdmins(list);
    } catch {
      setListError('Não foi possível carregar a lista de administradores.');
      setAdmins([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshAdmins();
    }, [refreshAdmins])
  );

  const submit = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    if (!username.trim()) {
      setError('Indique o e-mail ou nome de utilizador para o novo administrador.');
      return null;
    }
    if (!password) {
      setError('Indique a senha inicial.');
      return null;
    }
    setLoading(true);
    try {
      const res = await adminService.criarAdmin({ username: username.trim(), password });
      setSuccessMessage(`Administrador criado: ${res.username}.`);
      setUsername('');
      setPassword('');
      await refreshAdmins();
      return res;
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data;
      const msg = typeof data?.message === 'string' ? data.message : 'Não foi possível criar o administrador.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [username, password, refreshAdmins]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    submit,
    admins,
    listLoading,
    listError,
    refreshAdmins,
  };
}
