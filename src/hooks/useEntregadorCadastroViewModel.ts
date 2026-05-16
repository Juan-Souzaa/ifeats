import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import type { EntregadorRequestDTO, TipoVeiculo } from '../types/api';
import * as entregadorService from '../services/entregadorService';
import { validateSenha } from '../utils/validation';

export function useEntregadorCadastroViewModel() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fotoCnhUrl, setFotoCnhUrl] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>('MOTO');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const usarLocalizacao = useCallback(async () => {
    setError(null);
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada. Ative nas configurações do aparelho.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
    } catch {
      setError('Não foi possível obter a localização.');
    } finally {
      setLocLoading(false);
    }
  }, []);

  const validate = useCallback((): string | null => {
    if (!nome.trim() || nome.trim().length < 2) return 'Nome deve ter entre 2 e 100 caracteres';
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length < 11 || cpfDigits.length > 14) return 'CPF inválido';
    const tel = telefone.replace(/\D/g, '');
    if (tel.length < 10 || tel.length > 15) return 'Telefone inválido';
    if (!email.trim() || !email.includes('@')) return 'E-mail inválido';
    const p = placaVeiculo.replace(/\s/g, '').toUpperCase();
    if (p.length < 7 || p.length > 8) return 'Placa deve ter 7 ou 8 caracteres';
    const s = validateSenha(password);
    if (s) return s;
    if (latitude == null || longitude == null) return 'Latitude e longitude são obrigatórias (use o botão de localização)';
    return null;
  }, [nome, cpf, telefone, email, placaVeiculo, password, latitude, longitude]);

  const submit = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    const v = validate();
    if (v) {
      setError(v);
      return null;
    }
    const dto: EntregadorRequestDTO = {
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ''),
      telefone: telefone.trim(),
      email: email.trim(),
      tipoVeiculo,
      placaVeiculo: placaVeiculo.replace(/\s/g, '').toUpperCase(),
      latitude: latitude!,
      longitude: longitude!,
      password,
      ...(fotoCnhUrl.trim() ? { fotoCnhUrl: fotoCnhUrl.trim() } : {}),
    };
    setLoading(true);
    try {
      const res = await entregadorService.cadastrarEntregador(dto);
      setSuccessMessage(`Cadastro enviado. Status: ${res.status}. Faça login quando for aprovado.`);
      return res;
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data;
      const msg = typeof data?.message === 'string' ? data.message : 'Erro ao cadastrar entregador';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [
    nome,
    cpf,
    telefone,
    email,
    password,
    fotoCnhUrl,
    tipoVeiculo,
    placaVeiculo,
    latitude,
    longitude,
    validate,
  ]);

  return {
    nome,
    setNome,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    email,
    setEmail,
    password,
    setPassword,
    fotoCnhUrl,
    setFotoCnhUrl,
    tipoVeiculo,
    setTipoVeiculo,
    placaVeiculo,
    setPlacaVeiculo,
    latitude,
    longitude,
    usarLocalizacao,
    loading,
    locLoading,
    error,
    successMessage,
    submit,
  };
}
