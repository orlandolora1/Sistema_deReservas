import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { obtenerServicio } from '../../features/reservas/reservasApi';
import { Servicio } from '../../features/reservas/types';

export default function DetalleServicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerServicio(id)
      .then(setServicio)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (error || !servicio) return <Text style={styles.error}>{error || 'Servicio no encontrado'}</Text>;

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: servicio.nombre }} />

      <Text style={styles.titulo}>{servicio.nombre}</Text>
      {servicio.descripcion ? <Text style={styles.descripcion}>{servicio.descripcion}</Text> : null}

      <View style={styles.info}>
        <Text style={styles.dato}>Duración: {servicio.duracion} min</Text>
        <Text style={styles.dato}>Precio: RD$ {servicio.precio.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push({ pathname: '/reservas/nueva', params: { servicioId: servicio.id, nombre: servicio.nombre } })}
      >
        <Text style={styles.botonTexto}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  descripcion: { fontSize: 16, color: '#555', marginBottom: 20 },
  info: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 30 },
  dato: { fontSize: 16, marginBottom: 6 },
  boton: { backgroundColor: '#1e6fd9', padding: 15, borderRadius: 10, alignItems: 'center' },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#c0392b', textAlign: 'center', marginTop: 40 },
});
