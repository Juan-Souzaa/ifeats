import { useCallback, useEffect, useState } from 'react';
import type {
  AvaliacaoEntregadorResponseDTO,
  AvaliacaoResumoEntregadorDTO,
  TipoVeiculo,
} from '../types/api';
import * as avaliacaoService from '../services/avaliacaoService';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';

export function useEntregadorPerfilViewModel() {
  const [id, setId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>('MOTO');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avaliacaoResumo, setAvaliacaoResumo] = useState<AvaliacaoResumoEntregadorDTO | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoEntregadorResponseDTO[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const e = await entregadorService.buscarMeuEntregador();
        setId(e.id);
        setNome(e.nome);
        setTelefone(e.telefone);
        setEmail(e.email);
        setPlacaVeiculo(e.placaVeiculo);
        setTipoVeiculo(e.tipoVeiculo);
        const [resumo, page] = await Promise.all([
          avaliacaoService.resumoEntregador(e.id),
          avaliacaoService.listarAvaliacoesEntregador(e.id, 0, 3),
        ]);
        setAvaliacaoResumo(resumo);
        setAvaliacoes(page.content ?? []);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    setSubmitting(true);
    setError(null);
    try {
      await entregadorService.atualizarEntregador(id, {
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        placaVeiculo: placaVeiculo.trim(),
        tipoVeiculo,
      });
      return true;
    } catch (err) {
      setError(extractErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [id, nome, telefone, email, placaVeiculo, tipoVeiculo]);

  return {
    nome,
    setNome,
    telefone,
    setTelefone,
    email,
    setEmail,
    placaVeiculo,
    setPlacaVeiculo,
    tipoVeiculo,
    setTipoVeiculo,
    loading,
    submitting,
    error,
    avaliacaoResumo,
    avaliacoes,
    salvar,
  };
}
