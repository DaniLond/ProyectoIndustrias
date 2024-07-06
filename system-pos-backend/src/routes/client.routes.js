import express from 'express';
import { getClients, registerClient, updateClient, deleteClient } from '../controllers/client.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { clienteRegisterSchema, clienteUpdateSchema } from '../schemas/client.schema.js';

const router = express.Router();

router.get('/clientes', getClients);
router.post('/clientes', validateSchema(clienteRegisterSchema), registerClient);
router.put('/clientes/:id', validateSchema(clienteUpdateSchema), updateClient);
router.delete('/clientes/:id', deleteClient);

export default router;
