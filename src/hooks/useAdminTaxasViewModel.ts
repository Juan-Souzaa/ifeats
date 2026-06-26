import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { ConfiguracaoTaxaResponseDTO, TipoTaxa } from '../types/api';
import * as adminService from '../services/adminService';
import { extractErrorMessage } from '../utils/errors';

export function useAdminTaxasViewModel() {
  const [tipoTaxa, setTipoTaxa] = useState<TipoTaxa>('TAXA_RESTAURANTE');
  const [percentual, setPercentual] = useState('');
  const [historico, setHistorico] = useState<ConfiguracaoTaxaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const h = await adminService.listarHistoricoTaxas(tipoTaxa);
      setHistorico(h);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [tipoTaxa]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const criar = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await adminService.criarConfiguracaoTaxa({
        tipoTaxa,
        percentual: Number(percentual.replace(',', '.')),
      });
      setPercentual('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [tipoTaxa, percentual, load]);

  return { tipoTaxa, setTipoTaxa, percentual, setPercentual, historico, loading, submitting, error, criar, refresh: load };
}
