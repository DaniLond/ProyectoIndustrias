import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Rutas para la autentificación de un usuario
router.post('/register', validateSchema(registerSchema), register); // Ruta para el registro de un usuario
router.post('/login', validateSchema(loginSchema), login); // Ruta para el inicio de sesión de un usuario
router.post('/logout', logout); // Ruta para cerrar sesión de un usuario

export default router;
