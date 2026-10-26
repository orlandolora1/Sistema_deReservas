const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Todas las rutas de servicios requieren estar autenticado
router.use(authMiddleware);

// Listar servicios (GET /servicios) - Autenticado
router.get('/', async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// Ver un servicio (GET /servicios/:id) - Autenticado
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    try {
        const servicio = await prisma.servicio.findUnique({ where: { id } });
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el servicio' });
    }
});

// Crear servicio (POST /servicios) - Solo admin
router.post('/', adminMiddleware, async (req, res) => {
    const { nombre, descripcion, duracion, precio } = req.body;
    try {
        const nuevoServicio = await prisma.servicio.create({
            data: { nombre, descripcion, duracion: parseInt(duracion), precio: parseFloat(precio) }
        });
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// Editar servicio (PUT /servicios/:id) - Solo admin
router.put('/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, duracion, precio } = req.body;
    try {
        const servicioActualizado = await prisma.servicio.update({
            where: { id: parseInt(id) },
            data: { nombre, descripcion, duracion: parseInt(duracion), precio: parseFloat(precio) }
        });
        res.json(servicioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar servicio' });
    }
});

// Eliminar servicio (DELETE /servicios/:id) - Solo admin
router.delete('/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.servicio.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar servicio' });
    }
});

module.exports = router;
