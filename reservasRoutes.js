const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const esAdmin = require('../middleware/esAdmin');
const {
    crearReserva,
    obtenerReservas,
    obtenerReservaPorId,
    cancelarReserva,
    cambiarEstado
} = require('../controllers/reservasController');

const router = express.Router();

// Todas las rutas de reservas requieren estar autenticado
router.use(authMiddleware);

// Crear reserva (POST /reservas) - Autenticado
router.post('/', crearReserva);

// Listar reservas (GET /reservas) - Admin ve todas, cliente solo las suyas
router.get('/', obtenerReservas);

// Ver una reserva (GET /reservas/:id) - Dueño o admin
router.get('/:id', obtenerReservaPorId);

// Cancelar reserva (PATCH /reservas/:id/cancelar) - Solo el dueño, si está pendiente
router.patch('/:id/cancelar', cancelarReserva);

// Cambiar estado (PATCH /reservas/:id/estado) - Solo admin
router.patch('/:id/estado', esAdmin, cambiarEstado);

module.exports = router;
