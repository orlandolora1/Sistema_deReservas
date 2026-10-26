const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada'];

// Crear reserva (POST /reservas) - Cliente autenticado
const crearReserva = async (req, res) => {
    const { servicioId, fecha, notas } = req.body;

    if (!servicioId || !fecha) {
        return res.status(400).json({ error: 'servicioId y fecha son obligatorios' });
    }

    const idServicio = parseInt(servicioId);
    if (isNaN(idServicio)) {
        return res.status(400).json({ error: 'servicioId inválido' });
    }

    const fechaReserva = new Date(fecha);
    if (isNaN(fechaReserva.getTime())) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    // No se permiten reservas en fechas pasadas
    if (fechaReserva < new Date()) {
        return res.status(400).json({ error: 'No se puede reservar en una fecha pasada' });
    }

    try {
        const servicio = await prisma.servicio.findUnique({ where: { id: idServicio } });
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

        // El estado inicial siempre es 'pendiente' (no se toma del body)
        const reserva = await prisma.reserva.create({
            data: {
                fecha: fechaReserva,
                notas,
                usuarioId: req.user.id,
                servicioId: idServicio
            },
            include: { servicio: true }
        });
        res.status(201).json(reserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

// Listar reservas (GET /reservas)
// El admin ve todas; el cliente solo ve las suyas
const obtenerReservas = async (req, res) => {
    try {
        const filtro = req.user.rol === 'admin' ? {} : { usuarioId: req.user.id };

        const reservas = await prisma.reserva.findMany({
            where: filtro,
            include: {
                servicio: true,
                usuario: { select: { id: true, nombre: true, email: true } }
            },
            orderBy: { fecha: 'asc' }
        });
        res.json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

// Obtener una reserva (GET /reservas/:id) - Dueño o admin
const obtenerReservaPorId = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id },
            include: { servicio: true }
        });
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        if (req.user.rol !== 'admin' && reserva.usuarioId !== req.user.id) {
            return res.status(403).json({ error: 'No tienes permiso para ver esta reserva' });
        }
        res.json(reserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

// Cancelar reserva (PATCH /reservas/:id/cancelar) - Solo el dueño
const cancelarReserva = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    try {
        const reserva = await prisma.reserva.findUnique({ where: { id } });
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        if (reserva.usuarioId !== req.user.id) {
            return res.status(403).json({ error: 'Solo puedes cancelar tus propias reservas' });
        }
        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({ error: 'Solo se pueden cancelar reservas pendientes' });
        }

        const reservaCancelada = await prisma.reserva.update({
            where: { id },
            data: { estado: 'cancelada' },
            include: { servicio: true }
        });
        res.json({ message: 'Reserva cancelada', reserva: reservaCancelada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
};

// Cambiar estado (PATCH /reservas/:id/estado) - Solo admin
const cambiarEstado = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { estado } = req.body;
    if (!ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }

    try {
        const reserva = await prisma.reserva.findUnique({ where: { id } });
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        const reservaActualizada = await prisma.reserva.update({
            where: { id },
            data: { estado },
            include: { servicio: true }
        });
        res.json(reservaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar el estado' });
    }
};

module.exports = {
    crearReserva,
    obtenerReservas,
    obtenerReservaPorId,
    cancelarReserva,
    cambiarEstado
};
