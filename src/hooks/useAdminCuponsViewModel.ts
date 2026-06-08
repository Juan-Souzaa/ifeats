import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { CupomRequestDTO, CupomResponseDTO, TipoDesconto } from '../types/api';
import * as cupomService from '../services/cupomService';
import { daquiDiasApi, hojeApi } from '../utils/data';

function datasPadrao() {
  return { inicio: hojeApi(), fim: daquiDiasApi(30) };
}

export function useAdminCuponsViewModel() {
  const [lista, setLista] = useState<CupomResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto>('PERCENTUAL');
  const [valorDesconto, setValorDesconto] = useState('');
  const [valorMinimo, setValorMinimo] = useState('0');
  const [dataInicio, setDataInicio] = useState(() => datasPadrao().inicio);
  const [dataFim, setDataFim] = useState(() => datasPadrao().fim);
  const [usosMaximos, setUsosMaximos] = useState('100');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const page = await cupomService.listarTodosCupons();
      setLista(page.content ?? []);
    } catch {
      setError('Não foi possível carregar os cupons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const montarDto = useCallback(
    (): CupomRequestDTO => ({
      codigo: codigo.trim().toUpperCase(),
      tipoDesconto,
      valorDesconto: Number(valorDesconto.replace(',', '.')),
      valorMinimo: Number(valorMinimo.replace(',', '.')),
      dataInicio,
      dataFim,
      usosMaximos: Number(usosMaximos) || 100,
    }),
    [codigo, tipoDesconto, valorDesconto, valorMinimo, dataInicio, dataFim, usosMaximos]
  );

  const validarForm = useCallback(() => {
    if (!codigo.trim() || !dataInicio || !dataFim) {
      setError('Preencha código e datas.');
      return false;
    }
    if (dataFim < dataInicio) {
      setError('A data fim deve ser igual ou posterior à data início.');
      return false;
    }
    return true;
  }, [codigo, dataInicio, dataFim]);

  const criar = useCallback(async () => {
    if (!validarForm()) return;
    setBusy(true);
    setError(null);
    try {
      await cupomService.criarCupom(montarDto());
      setCodigo('');
      setValorDesconto('');
      setValorMinimo('0');
      setUsosMaximos('100');
      const padrao = datasPadrao();
      setDataInicio(padrao.inicio);
      setDataFim(padrao.fim);
      await load();
    } catch {
      setError('Não foi possível criar o cupom.');
    } finally {
      setBusy(false);
    }
  }, [validarForm, montarDto, load]);

  const iniciarEdicao = useCallback((cup: CupomResponseDTO) => {
    setEditandoId(cup.id);
    setCodigo(cup.codigo);
    setTipoDesconto(cup.tipoDesconto);
    setValorDesconto(String(cup.valorDesconto));
    setValorMinimo(String(cup.valorMinimo));
    setDataInicio(cup.dataInicio.slice(0, 10));
    setDataFim(cup.dataFim.slice(0, 10));
    setUsosMaximos(String(cup.usosMaximos));
  }, []);

  const cancelarEdicao = useCallback(() => {
    setEditandoId(null);
    setCodigo('');
    setValorDesconto('');
    setValorMinimo('0');
    const padrao = datasPadrao();
    setDataInicio(padrao.inicio);
    setDataFim(padrao.fim);
    setUsosMaximos('100');
  }, []);

  const salvarEdicao = useCallback(async () => {
    if (!editandoId || !validarForm()) return;
    setBusy(true);
    setError(null);
    try {
      await cupomService.atualizarCupom(editandoId, montarDto());
      cancelarEdicao();
      await load();
    } catch {
      setError('Não foi possível atualizar o cupom.');
    } finally {
      setBusy(false);
    }
  }, [editandoId, validarForm, montarDto, cancelarEdicao, load]);

  const toggle = useCallback(
    async (cup: CupomResponseDTO) => {
      setBusy(true);
      try {
        if (cup.ativo) await cupomService.desativarCupom(cup.id);
        else await cupomService.ativarCupom(cup.id);
        await load();
      } catch {
        setError('Não foi possível atualizar o cupom.');
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  return {
    lista,
    loading,
    busy,
    error,
    codigo,
    setCodigo,
    tipoDesconto,
    setTipoDesconto,
    valorDesconto,
    setValorDesconto,
    valorMinimo,
    setValorMinimo,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    usosMaximos,
    setUsosMaximos,
    criar,
    editandoId,
    iniciarEdicao,
    cancelarEdicao,
    salvarEdicao,
    toggle,
    refresh: load,
  };
}
