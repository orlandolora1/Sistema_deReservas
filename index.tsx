import { useCallback, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { obtenerMisReservas, cancelarReserva } from '../../features/reservas/reservasApi';
import { Reserva } from '../../features/reservas/types';
import ReservaCard from '../../features/reservas/ReservaCard';

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    try {
      setReservas(await obtenerMisReservas());
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };

  // Recarga cada vez que se entra a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const confirmarCancelacion = (id: number) => {
    Alert.alert('Cancelar reserva', '¿Seguro que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelarReserva(id);
            cargar();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  if (cargando) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis reservas</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReservaCard reserva={item} onCancelar={confirmarCancelacion} />}
        ListEmptyComponent={<Text style={styles.vacio}>Aún no tienes reservas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  vacio: { textAlign: 'center', color: '#777', marginTop: 40 },
});
