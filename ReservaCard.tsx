import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Reserva } from './types';
import { formatearFecha } from '../../lib/fechas';

const COLORES = {
  pendiente: '#f0a500',
  confirmada: '#2e9e4f',
  cancelada: '#c0392b',
};

type Props = {
  reserva: Reserva;
  onCancelar: (id: number) => void;
};

export default function ReservaCard({ reserva, onCancelar }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.fila}>
        <Text style={styles.servicio}>{reserva.servicio.nombre}</Text>
        <Text style={[styles.estado, { backgroundColor: COLORES[reserva.estado] }]}>
          {reserva.estado}
        </Text>
      </View>

      <Text style={styles.texto}>Fecha: {formatearFecha(reserva.fecha)}</Text>
      {reserva.notas ? <Text style={styles.texto}>Notas: {reserva.notas}</Text> : null}

      {/* Solo las reservas pendientes se pueden cancelar */}
      {reserva.estado === 'pendiente' && (
        <TouchableOpacity style={styles.boton} onPress={() => onCancelar(reserva.id)}>
          <Text style={styles.botonTexto}>Cancelar reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  servicio: { fontSize: 17, fontWeight: 'bold' },
  estado: { color: '#fff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, overflow: 'hidden', textTransform: 'capitalize' },
  texto: { fontSize: 14, color: '#444', marginBottom: 4 },
  boton: { marginTop: 10, borderWidth: 1, borderColor: '#c0392b', padding: 10, borderRadius: 8, alignItems: 'center' },
  botonTexto: { color: '#c0392b', fontWeight: 'bold' },
});
