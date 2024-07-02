import { Router } from 'express';
import { register, login, logout, verifyToken, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js';

const router = Router();

// Rutas para la autentificación de un usuario
router.post('/register', validateSchema(registerSchema), register); // Ruta para el registro de un usuario
router.post('/login', validateSchema(loginSchema), login); // Ruta para el inicio de sesión de un usuario
router.post('/logout', logout); // Ruta para cerrar sesión de un usuario
router.get('/verify-token', verifyToken); // Ruta para validar los tokens de los usuarios
router.post('/forgot-password', validateSchema(forgotPasswordSchema), forgotPassword); // Ruta para enviar el token para restablecer la contraseña
router.post('/reset-password/:token', validateSchema(resetPasswordSchema), resetPassword); // Ruta para cambiar la contraseña

export default router;
