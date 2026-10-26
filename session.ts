import * as SecureStore from 'expo-secure-store';

const CLAVE_TOKEN = 'token';

// Guardar el token después del login
export async function guardarToken(token: string) {
  await SecureStore.setItemAsync(CLAVE_TOKEN, token);
}

export async function obtenerToken() {
  return await SecureStore.getItemAsync(CLAVE_TOKEN);
}

export async function borrarToken() {
  await SecureStore.deleteItemAsync(CLAVE_TOKEN);
}
