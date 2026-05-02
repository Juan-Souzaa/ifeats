import { useCallback, useState } from 'react';
import type { RestauranteRequestDTO } from '../types/api';
import * as restauranteService from '../services/restauranteService';
import { normalizeCep, validateCep, validateEstado, validateSenha } from '../utils/validation';

const emptyEndereco = () => ({
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
});

export function useRestauranteCadastroViewModel() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [raioKm, setRaioKm] = useState('');
  const [endereco, setEndereco] = useState(emptyEndereco);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setEnderecoField = useCallback(
    (field: keyof ReturnType<typeof emptyEndereco>, value: string) => {
      setEndereco((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validate = useCallback((): string | null => {
    if (!nome.trim()) return 'Nome é obrigatório';
    if (!endereco.logradouro.trim()) return 'Logradouro é obrigatório';
    if (!endereco.numero.trim()) return 'Número é obrigatório';
    if (!endereco.bairro.trim()) return 'Bairro é obrigatório';
    if (!endereco.cidade.trim()) return 'Cidade é obrigatória';
    const est = validateEstado(endereco.estado);
    if (est) return est;
    const cepErr = validateCep(endereco.cep);
    if (cepErr) return cepErr;
    if (!telefone.trim()) return 'Telefone é obrigatório';
    if (!email.trim()) return 'E-mail é obrigatório';
    const s = validateSenha(password);
    if (s) return s;
    if (raioKm.trim()) {
      const r = Number(raioKm.replace(',', '.'));
      if (Number.isNaN(r) || r < 0.1) return 'Raio de entrega deve ser no mínimo 0,1 km';
    }
    return null;
  }, [nome, endereco, telefone, email, password, raioKm]);

  const submit = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    const v = validate();
    if (v) {
      setError(v);
      return null;
    }
    const dto: RestauranteRequestDTO = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      password,
      endereco: {
        logradouro: endereco.logradouro.trim(),
        numero: endereco.numero.trim(),
        bairro: endereco.bairro.trim(),
        cidade: endereco.cidade.trim(),
        estado: endereco.estado.trim().toUpperCase(),
        cep: normalizeCep(endereco.cep),
        ...(endereco.complemento.trim() ? { complemento: endereco.complemento.trim() } : {}),
      },
    };
    if (raioKm.trim()) {
      dto.raioEntregaKm = Number(raioKm.replace(',', '.'));
    }
    setLoading(true);
    try {
      const res = await restauranteService.cadastrarRestaurante(dto);
      setSuccessMessage(`Restaurante criado. Status: ${res.status}. Faça login com o e-mail cadastrado.`);
      return res;
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data;
      const msg = typeof data?.message === 'string' ? data.message : 'Erro ao cadastrar';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [nome, telefone, email, password, raioKm, endereco, validate]);

  return {
    nome,
    setNome,
    telefone,
    setTelefone,
    email,
    setEmail,
    password,
    setPassword,
    raioKm,
    setRaioKm,
    endereco,
    setEnderecoField,
    loading,
    error,
    successMessage,
    submit,
  };
}
