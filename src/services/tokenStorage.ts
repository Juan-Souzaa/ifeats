import * as SecureStore from 'expo-secure-store';

const KEY = 'ifeats_jwt';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  if (token == null) {
    await SecureStore.deleteItemAsync(KEY);
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}
