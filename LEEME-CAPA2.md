# Capa 2: Reservas — qué agregar y dónde

Este zip tiene **solo lo nuevo o lo modificado**. Se copia encima del proyecto que ya tienes; no borres nada.

## 1. Backend (tu repo `Sistema_deReservas`)

Copia la carpeta `backend/` del zip **dentro de la raíz de tu repo** (donde está `package.json`).
Cuando Windows pregunte, elige **Reemplazar los archivos en el destino**.

| Archivo | Qué es |
|---|---|
| `prisma/schema.prisma` | **Modificado**: agrega el modelo `Reserva` y la relación `reservas` en `Usuario` y `Servicio` |
| `src/index.js` | **Modificado**: 2 líneas para montar `/reservas` |
| `src/routes/serviciosRoutes.js` | **Modificado**: agrega `GET /servicios/:id` (lo usa la pantalla de detalle) |
| `src/routes/reservasRoutes.js` | **Nuevo** |
| `src/controllers/reservasController.js` | **Nuevo** (la carpeta `controllers` es nueva) |
| `src/middleware/esAdmin.js` | **Nuevo** |

Luego, en la terminal dentro del proyecto:

```bash
npx prisma migrate dev --name reservas
npm run dev
```

### Endpoints nuevos (todos llevan `Authorization: Bearer <token>`)

| Método | Ruta | Quién | Body |
|---|---|---|---|
| POST | `/reservas` | cliente | `{ "servicioId": 1, "fecha": "2026-11-05T15:00:00", "notas": "opcional" }` |
| GET | `/reservas` | admin ve todas, cliente solo las suyas | — |
| GET | `/reservas/:id` | dueño o admin | — |
| PATCH | `/reservas/:id/cancelar` | solo el dueño, si está `pendiente` | — |
| PATCH | `/reservas/:id/estado` | solo admin (`esAdmin`) | `{ "estado": "confirmada" }` |

### Reglas que cumple

- No acepta fechas pasadas → 400.
- Toda reserva nace en estado `pendiente` (aunque el cliente mande otro estado, se ignora).
- Solo el admin cambia el estado (`pendiente`, `confirmada`, `cancelada`) → si no, 403.
- El cliente solo ve y cancela sus reservas → si intenta con una ajena, 403.
- Solo se cancelan reservas `pendiente` → si no, 400.

### Prueba rápida en Thunder Client

1. `POST /auth/login` con un cliente → copia el `token`.
2. `GET /servicios` → anota un `id`.
3. `POST /reservas` con fecha futura → **201**, `estado: "pendiente"`.
4. `POST /reservas` con `"fecha": "2020-01-01T10:00:00"` → **400**.
5. `GET /reservas` → solo ves las tuyas.
6. `PATCH /reservas/1/estado` con el token del cliente → **403**.
7. Login como admin → `PATCH /reservas/1/estado` `{ "estado": "confirmada" }` → **200**.
8. Con el cliente, crea otra reserva y `PATCH /reservas/2/cancelar` → **200**, `estado: "cancelada"`.

## 2. App móvil (tu proyecto Expo)

Copia el contenido de `app-movil/` en la **raíz de tu proyecto Expo** (donde está su `package.json`):

```
app/servicios/[id].tsx        -> detalle del servicio + botón Reservar
app/reservas/nueva.tsx        -> formulario de nueva reserva
app/reservas/index.tsx        -> mis reservas, con botón Cancelar en las pendientes
features/reservas/            -> types.ts, reservasApi.ts, ReservaCard.tsx
lib/                          -> api.ts (URL + token), session.ts (guardar token), fechas.ts
```

Instala la dependencia para guardar el token:

```bash
npx expo install expo-secure-store
```

**Tres cosas que debes ajustar a tu app:**

1. En `lib/api.ts`, cambia `API_URL` por la IP de tu PC (`ipconfig` → Dirección IPv4), por ejemplo `http://192.168.1.25:3000`. El celular y la PC deben estar en la misma WiFi.
2. En tu pantalla de login, después de recibir la respuesta, guarda el token:
   ```ts
   import { guardarToken } from '../lib/session'; // ajusta la ruta relativa
   await guardarToken(data.token);
   ```
   Si tu app ya guarda el token de otra forma, cambia `obtenerToken()` en `lib/session.ts` para que lo lea de ahí.
3. En tu lista de servicios, haz que cada servicio abra su detalle:
   ```tsx
   import { router } from 'expo-router';
   <TouchableOpacity onPress={() => router.push(`/servicios/${item.id}`)}>
   ```
   Y agrega en algún lugar un botón hacia `/reservas` ("Mis reservas").

Si tus pantallas están dentro de un grupo, como `app/(app)/`, pon `servicios/` y `reservas/` dentro de ese grupo y ajusta los `../../` de los imports a un nivel más.

## 3. Capturas para entregar

1. Detalle de un servicio con el botón **Reservar**.
2. Formulario **Nueva reserva** lleno.
3. Mensaje de error al poner una fecha pasada.
4. **Mis reservas** mostrando una pendiente con botón **Cancelar**.
5. La misma lista después de cancelar (estado `cancelada`, sin botón).
6. Thunder Client: el 403 del cliente intentando cambiar estado y el 200 del admin.

## 4. Subir a GitHub

```bash
git add .
git commit -m "Capa 2: reservas (modelo, rutas, esAdmin y pantallas)"
git push
```
