import { obtenerToken } from './session';

// IP de tu PC en la red WiFi (en Windows: ipconfig -> Dirección IPv4).
// No uses "localhost": en el celular, localhost es el propio celular.
export const API_URL = 'http://192.168.1.100:3000';

// fetch con el token JWT incluido y manejo de errores del backend
export async function apiFetch(ruta: string, opciones: RequestInit = {}) {
  const token = await obtenerToken();

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {}),
    },
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(datos?.error || `Error ${respuesta.status}`);
  }
  return datos;
}
