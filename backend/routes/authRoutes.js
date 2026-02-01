const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { generateToken } = require('../utils/jwt');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

// Validaciones para registro
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('rol').optional().isIn(['admin', 'cajero']).withMessage('Rol inválido')
];

// Registro de staff (solo admin puede crear cuentas)
router.post('/register',
    registerValidation,
    authMiddleware, 
    requireRole(['admin']),
    async (req, res) => {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password, rol } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Crear usuario (solo staff: admin o cajero)
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rol || 'cajero' // Por defecto cajero si no se especifica
        });

        // Generar token JWT
        const token = generateToken(nuevoUsuario);

        // Responder con token y datos del usuario (sin password)
        res.status(201).json({ 
            message: "Usuario de staff registrado con éxito ✅",
            token,
            user: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
});

// Validaciones para login
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Login
router.post('/login', loginValidation, async (req, res) => {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Generar token JWT
        const token = generateToken(usuario);

        // Responder con token y datos del usuario (sin password)
        res.status(200).json({
            message: "Login exitoso",
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
});

module.exports = router;