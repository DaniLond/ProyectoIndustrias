import express from 'express';
import { getEmployees, registerEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { employeeRegisterSchema, employeeUpdateSchema } from '../schemas/employee.schema.js';

const router = express.Router();

router.get('/employees', getEmployees);
router.post('/employees', validateSchema(employeeRegisterSchema), registerEmployee);
router.put('/employees/:id', validateSchema(employeeUpdateSchema), updateEmployee);
router.delete('/employees/:id', deleteEmployee);

export default router;