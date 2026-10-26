import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { crearReserva } from '../../features/reservas/reservasApi';
import { unirFechaHora } from '../../lib/fechas';

export default function NuevaReserva() {
  const { servicioId, nombre } = useLocalSearchParams<{ servicioId: string; nombre: string }>();
  const router = useRouter();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);

  const guardar = async () => {
    const fechaReserva = unirFechaHora(fecha, hora);

    if (!fechaReserva) {
      Alert.alert('Datos inválidos', 'Escribe la fecha como AAAA-MM-DD y la hora como HH:MM');
      return;
    }
    if (fechaReserva < new Date()) {
      Alert.alert('Fecha inválida', 'No puedes reservar en una fecha pasada');
      return;
    }

    setEnviando(true);
    try {
      await crearReserva(Number(servicioId), fechaReserva, notas);
      Alert.alert('Listo', 'Tu reserva quedó pendiente de confirmación');
      router.replace('/reservas');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Nueva reserva</Text>
      <Text style={styles.servicio}>Servicio: {nombre}</Text>

      <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2026-10-30" value={fecha} onChangeText={setFecha} />

      <Text style={styles.label}>Hora (HH:MM)</Text>
      <TextInput style={styles.input} placeholder="14:30" value={hora} onChangeText={setHora} />

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        multiline
        value={notas}
        onChangeText={setNotas}
      />

      <TouchableOpacity style={styles.boton} onPress={guardar} disabled={enviando}>
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>Confirmar reserva</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  servicio: { fontSize: 16, color: '#555', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  boton: { backgroundColor: '#1e6fd9', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
