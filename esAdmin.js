// Verifica que el usuario autenticado tenga rol de admin.
// Se usa después de authMiddleware, porque necesita req.user.
const esAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo el admin puede realizar esta acción.' });
    }
    next();
};

module.exports = esAdmin;
