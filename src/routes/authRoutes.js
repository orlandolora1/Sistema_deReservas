const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/registro', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Si no envían rol, por defecto será 'cliente'
        const userRol = rol === 'admin' ? 'admin' : 'cliente';
        
        const usuario = await prisma.usuario.create({
            data: { nombre, email, password: hashedPassword, rol: userRol }
        });
        
        res.status(201).json({ message: 'Usuario registrado', usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol } });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') return res.status(400).json({ error: 'El email ya está en uso' });
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ message: 'Login exitoso', token, rol: usuario.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el login' });
    }
});

module.exports = router;
