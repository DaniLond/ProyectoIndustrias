import { Router } from 'express';
import { getOrders, getOrderById, getProductToOrder, createOrder, updateOrder, deleteProductFromOrder } from '../controllers/order.controller.js';

const router = Router();

// Rutas para el CRUD de los productos (salas)
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.post('/create-order', createOrder);
router.put('/edit-order/:id', updateOrder); 
router.delete('/delete-product/:id', deleteProductFromOrder);
router.get('/orders/:id/products', getProductToOrder);

export default router;