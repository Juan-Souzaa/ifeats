import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configureAuthTokenGetter } from '../services/http';
import { getStoredToken, setStoredToken } from '../services/tokenStorage';

type AuthContextValue = {
  token: string | null;
  isReady: boolean;
  setToken: (value: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    configureAuthTokenGetter(getStoredToken);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await getStoredToken();
      if (!cancelled) {
        setTokenState(t);
        setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setToken = useCallback(async (value: string | null) => {
    await setStoredToken(value);
    setTokenState(value);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isReady,
      setToken,
    }),
    [token, isReady, setToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
