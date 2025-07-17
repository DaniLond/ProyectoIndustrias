import express from 'express';
import {
	getCompletedTasksForPayment,
	createPayment,
	getEmployeePaymentHistory,
	getPaymentDetails,
	getAvailableConcepts,
	createConcept,
	getAllPayments,
	getPaymentStatistics,
	getPaidProductsByPayment,
	createManualPayment,
	getPaymentsByDateRange,
} from '../controllers/payment.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { paymentCreateSchema, conceptCreateSchema } from '../schemas/payment.schema.js';

const router = express.Router();

router.get('/payments/statistics', getPaymentStatistics);
router.get('/payments/by-date', getPaymentsByDateRange);
router.get('/payment-concepts', getAvailableConcepts);
router.post('/payment-concepts', validateSchema(conceptCreateSchema), createConcept);
router.post('/payments/manual', createManualPayment);
router.get('/payments/employee/:employeeId/tasks', getCompletedTasksForPayment);
router.get('/payments/employee/:employeeId/history', getEmployeePaymentHistory);
router.get('/payments/:paymentId', getPaymentDetails);
router.get('/payments/:paymentId/products', getPaidProductsByPayment);
router.get('/payments', getAllPayments);
router.post('/payments', validateSchema(paymentCreateSchema), createPayment);

export default router;
