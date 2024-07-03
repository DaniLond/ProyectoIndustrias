import { Router } from 'express';
import {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/product.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createProductSchema } from '../schemas/product.schema.js';

const router = Router();

// Rutas para el CRUD de los productos (salas)
router.get('/products', authenticateToken, getProducts); // Ruta para obtener todas los productos registrados
router.get('/products/:name', authenticateToken, getProduct); // Ruta para obtener un solo producto
router.post('/create-product', authenticateToken, validateSchema(createProductSchema), createProduct); // Ruta para crear un nuevo producto
router.put('/edit-product/:name', authenticateToken, updateProduct); // Ruta para editar un producto
router.delete('/delete-product/:name', authenticateToken, deleteProduct); // Ruta para eliminar un producto

export default router;
