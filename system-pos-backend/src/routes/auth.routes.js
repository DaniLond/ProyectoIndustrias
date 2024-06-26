import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Rutas para la autentificación de un usuario
router.post('/register', register); // Ruta para el registro de un usuario
router.post('/login', login); // Ruta para el inicio de sesión de un usuario

export default router;
