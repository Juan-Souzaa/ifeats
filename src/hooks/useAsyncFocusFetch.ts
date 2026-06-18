import { useCallback, useState, type DependencyList } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { extractErrorMessage } from '../utils/errors';

type Options<T> = {
  errorMessage?: string;
  initialData?: T;
  pollIntervalMs?: number;
};

export function useAsyncFocusFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
  options: Options<T> = {}
) {
  const { errorMessage = 'Ocorreu um erro. Tente novamente.', initialData, pollIntervalMs } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const result = await fetcher();
        setData(result);
      } catch (err) {
        if (!silent) {
          setError(extractErrorMessage(err) || errorMessage);
          if (initialData !== undefined) setData(initialData);
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, errorMessage, initialData, ...deps]
  );

  useFocusEffect(
    useCallback(() => {
      void refresh(false);
      if (!pollIntervalMs) return undefined;
      const interval = setInterval(() => void refresh(true), pollIntervalMs);
      return () => clearInterval(interval);
    }, [refresh, pollIntervalMs])
  );

  return { data, loading, error, refresh: () => refresh(false) };
}
