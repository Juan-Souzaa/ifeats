import { useCallback, useEffect, useState } from 'react';
import type { EnderecoRequestDTO } from '../types/api';
import * as enderecoService from '../services/enderecoService';
import * as restauranteService from '../services/restauranteService';
import { useEnderecoViaCep } from './useEnderecoViaCep';
import { resolveMediaUrl } from '../utils/imageUrl';
import { extractErrorMessage } from '../utils/errors';

const emptyEndereco = (): EnderecoRequestDTO => ({
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  principal: true,
});

export function useRestauranteEditarPerfilViewModel() {
  const [id, setId] = useState<number | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoMime, setFotoMime] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<EnderecoRequestDTO>(emptyEndereco);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergeCep = useCallback((p: Partial<EnderecoRequestDTO>) => {
    setEndereco((prev) => ({ ...prev, ...p }));
  }, []);

  const { cepBuscando, cepAviso } = useEnderecoViaCep(endereco.cep, mergeCep);

  useEffect(() => {
    (async () => {
      try {
        const r = await restauranteService.buscarMeuRestaurante();
        setId(r.id);
        setNome(r.nome);
        setEmail(r.email);
        setTelefone(r.telefone);
        setFotoUrl(r.fotoUrl);

        const list = await enderecoService.listarEnderecosRestaurante(r.id);
        const principal = list.find((e) => e.principal) ?? list[0];
        if (principal) {
          setEnderecoId(principal.id);
          setEndereco({
            logradouro: principal.logradouro,
            numero: principal.numero,
            complemento: principal.complemento ?? '',
            bairro: principal.bairro,
            cidade: principal.cidade,
            estado: principal.estado,
            cep: principal.cep,
            principal: true,
          });
        }
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setEnderecoField = useCallback((field: keyof EnderecoRequestDTO, value: string) => {
    setEndereco((prev) => ({ ...prev, [field]: value }));
  }, []);

  const fotoPreview = fotoUri ?? resolveMediaUrl(fotoUrl) ?? null;

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    if (!endereco.logradouro.trim() || !endereco.numero.trim() || !endereco.bairro.trim()) {
      setError('Preencha logradouro, número e bairro.');
      return false;
    }
    if (!endereco.cidade.trim() || !endereco.estado.trim() || !endereco.cep.replace(/\D/g, '')) {
      setError('Preencha CEP, cidade e estado.');
      return false;
    }

    setSubmitting(true);
    setError(null);
    try {
      await restauranteService.atualizarRestaurante(id, {
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
      });

      const dto: EnderecoRequestDTO = {
        ...endereco,
        cep: endereco.cep.replace(/\D/g, ''),
        estado: endereco.estado.toUpperCase().slice(0, 2),
        principal: true,
      };

      if (enderecoId) {
        await enderecoService.atualizarEnderecoRestaurante(id, enderecoId, dto);
      } else {
        await enderecoService.criarEnderecoRestaurante(id, dto);
      }

      if (fotoUri) {
        const updated = await restauranteService.atualizarFotoRestaurante(id, fotoUri, fotoMime ?? undefined);
        setFotoUrl(updated.fotoUrl);
        setFotoUri(null);
        setFotoMime(null);
      }

      return true;
    } catch (e) {
      setError(extractErrorMessage(e));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [id, enderecoId, nome, email, telefone, endereco, fotoUri, fotoMime]);

  return {
    nome,
    setNome,
    email,
    setEmail,
    telefone,
    setTelefone,
    endereco,
    setEnderecoField,
    cepBuscando,
    cepAviso,
    fotoPreview,
    setFotoUri,
    setFotoMime,
    loading,
    submitting,
    error,
    salvar,
  };
}
