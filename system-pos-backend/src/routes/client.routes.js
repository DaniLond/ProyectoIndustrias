import express from 'express';
import { getClients, registerClient, updateClient, deleteClient } from '../controllers/client.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { clienteSchema, clienteUpdateSchema } from './schemas/clienteSchema.js';

const router = express.Router();

router.get('/clientes', getClients);
router.post('/Clientes', validateSchema(clienteSchema), registerClient);
router.put('/clientes/:id', validateSchema(clienteUpdateSchema), updateClient);
router.delete('/clientes:id', deleteClient);

export default router;
