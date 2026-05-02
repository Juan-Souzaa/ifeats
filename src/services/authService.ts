import { publicApi } from './http';

export async function login(username: string, password: string): Promise<string> {
  const { data, status } = await publicApi.post<string>(
    '/api/auth/authenticate',
    { username, password },
    {
      responseType: 'text',
      transformResponse: [(body) => body],
    }
  );
  if (status !== 200 || typeof data !== 'string') {
    throw new Error('Resposta de login inválida');
  }
  return data.trim();
}
