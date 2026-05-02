import axios from 'axios';

const baseURL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';

/** Requisições públicas (sem Bearer). */
export const publicApi = axios.create({
  baseURL,
  timeout: 45000,
});

let tokenGetter: () => Promise<string | null> = async () => null;

export function configureAuthTokenGetter(getter: () => Promise<string | null>): void {
  tokenGetter = getter;
}

/** Requisições autenticadas (JWT). */
export const api = axios.create({
  baseURL,
  timeout: 45000,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  if (config.data instanceof FormData) {
    const h = config.headers;
    if (h && typeof h === 'object') {
      delete (h as Record<string, unknown>)['Content-Type'];
      delete (h as Record<string, unknown>)['content-type'];
    }
  }
  return config;
});

export function getApiBaseUrl(): string {
  return baseURL;
}
