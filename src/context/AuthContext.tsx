import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { JwtRole } from '../types/api';
import { configureAuthTokenGetter } from '../services/http';
import { getStoredToken, setStoredToken } from '../services/tokenStorage';
import { parseRolesFromJwt } from '../utils/jwtRoles';

type AuthContextValue = {
  token: string | null;
  roles: JwtRole[];
  isReady: boolean;
  setToken: (value: string | null) => Promise<void>;
  hasRole: (role: JwtRole) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const roles = useMemo(() => parseRolesFromJwt(token), [token]);

  const hasRole = useCallback(
    (role: JwtRole) => roles.includes(role),
    [roles]
  );

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
      roles,
      isReady,
      setToken,
      hasRole,
    }),
    [token, roles, isReady, setToken, hasRole]
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
