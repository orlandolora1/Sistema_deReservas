export type Servicio = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  duracion: number;
  precio: number;
};

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

export type Reserva = {
  id: number;
  fecha: string;
  estado: EstadoReserva;
  notas?: string | null;
  servicioId: number;
  usuarioId: number;
  servicio: Servicio;
};
