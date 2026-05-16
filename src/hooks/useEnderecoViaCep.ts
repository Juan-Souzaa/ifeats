import { useEffect, useRef, useState } from 'react';
import { consultarCep } from '../services/viacepService';

export type EnderecoCepPatch = {
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

/**
 * Quando o CEP tem 8 dígitos, consulta ViaCEP (debounce) e chama `onPatch` com campos encontrados.
 * `onPatch` pode mudar a cada render — usa ref internamente.
 */
export function useEnderecoViaCep(cep: string, onPatch: (p: EnderecoCepPatch) => void): {
  cepBuscando: boolean;
  cepAviso: string | null;
} {
  const [cepBuscando, setCepBuscando] = useState(false);
  const [cepAviso, setCepAviso] = useState<string | null>(null);
  const onPatchRef = useRef(onPatch);
  onPatchRef.current = onPatch;

  const digits = cep.replace(/\D/g, '');

  useEffect(() => {
    if (digits.length !== 8) {
      setCepAviso(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      (async () => {
        setCepBuscando(true);
        setCepAviso(null);
        try {
          const data = await consultarCep(digits);
          if (cancelled) return;
          if (!data) {
            setCepAviso('CEP não encontrado');
            return;
          }
          onPatchRef.current({
            ...(data.logradouro?.trim() ? { logradouro: data.logradouro.trim() } : {}),
            ...(data.bairro?.trim() ? { bairro: data.bairro.trim() } : {}),
            ...(data.localidade?.trim() ? { cidade: data.localidade.trim() } : {}),
            ...(data.uf?.trim() ? { estado: data.uf.trim().toUpperCase().slice(0, 2) } : {}),
          });
        } catch {
          if (!cancelled) {
            setCepAviso('Não foi possível consultar o CEP.');
          }
        } finally {
          if (!cancelled) setCepBuscando(false);
        }
      })();
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [digits]);

  return { cepBuscando, cepAviso };
}
