import express from 'express';
import {
	getPendingTasks,
	assignTask,
	getEmployeeTasks,
	updateTaskStatus,
	getOrderProgress,
	getTasksByOrderDetail,
} from '../controllers/task.controller.js';

const router = express.Router();

router.get('/tasks/pending/:employeeId', getPendingTasks);
router.post('/tasks/assign', assignTask);
router.get('/tasks/employee/:employeeId', getEmployeeTasks);
router.put('/tasks/update-status', updateTaskStatus);
router.get('/orders/:orderId/progress', getOrderProgress);
router.get('/order-detail/:orderDetailId/tasks', getTasksByOrderDetail);

export default router;
