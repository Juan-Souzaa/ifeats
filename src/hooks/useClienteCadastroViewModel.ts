import { useCallback, useState } from 'react';
import type { ClienteRequestDTO } from '../types/api';
import * as clienteService from '../services/clienteService';
import { useEnderecoViaCep } from './useEnderecoViaCep';
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

export function useClienteCadastroViewModel() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const mergeEnderecoCep = useCallback(
    (patch: { logradouro?: string; bairro?: string; cidade?: string; estado?: string }) => {
      setEndereco((prev) => ({
        ...prev,
        ...(patch.logradouro ? { logradouro: patch.logradouro } : {}),
        ...(patch.bairro ? { bairro: patch.bairro } : {}),
        ...(patch.cidade ? { cidade: patch.cidade } : {}),
        ...(patch.estado ? { estado: patch.estado } : {}),
      }));
    },
    []
  );

  const { cepBuscando, cepAviso } = useEnderecoViaCep(endereco.cep, mergeEnderecoCep);

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
    return null;
  }, [nome, endereco, telefone, email, password]);

  const submit = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    const v = validate();
    if (v) {
      setError(v);
      return null;
    }
    const dto: ClienteRequestDTO = {
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
    setLoading(true);
    try {
      const res = await clienteService.cadastrarCliente(dto);
      setSuccessMessage(`Conta criada. Faça login com o e-mail ${res.email}.`);
      return res;
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data;
      const msg = typeof data?.message === 'string' ? data.message : 'Erro ao cadastrar';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [nome, telefone, email, password, endereco, validate]);

  return {
    nome,
    setNome,
    telefone,
    setTelefone,
    email,
    setEmail,
    password,
    setPassword,
    endereco,
    setEnderecoField,
    loading,
    error,
    successMessage,
    cepBuscando,
    cepAviso,
    submit,
  };
}
