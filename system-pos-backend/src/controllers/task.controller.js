import { connectDB } from '../config/database.js';
import Task from '../models/task.model.js';

export const getPendingTasks = async (req, res, next) => {
	const { employeeId } = req.params;
	let connection;

	try {
		connection = await connectDB();

		const employeeRole = await Task.getEmployeeRole(connection, employeeId);
		if (!employeeRole) {
			return res.status(404).json({ error: 'Empleado no encontrado' });
		}

		const pendingTasks = await Task.getPendingTasksByWorkType(connection, employeeRole);

		res.status(200).json(pendingTasks);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const assignTask = async (req, res, next) => {
	const { employeeId, cardId } = req.body;
	let connection;

	try {
		connection = await connectDB();

		await Task.assignTaskToEmployee(connection, cardId, employeeId);

		res.status(200).json({ message: 'Tarea asignada exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getEmployeeTasks = async (req, res, next) => {
	const { employeeId } = req.params;
	let connection;

	try {
		connection = await connectDB();
		const tasks = await Task.getEmployeeTasks(connection, employeeId);
		res.status(200).json(tasks);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const updateTaskStatus = async (req, res, next) => {
	const { cardId, newStatus, workType } = req.body;
	let connection;

	try {
		connection = await connectDB();
		await Task.updateTaskStatus(connection, cardId, newStatus, workType);
		res.status(200).json({ message: 'Estado de la tarea actualizado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getOrderProgress = async (req, res, next) => {
	const { orderId } = req.params;
	let connection;

	try {
		connection = await connectDB();
		const progress = await Task.getOrderProgress(connection, orderId);
		res.status(200).json(progress);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getTasksByOrderDetail = async (req, res, next) => {
	const { orderDetailId } = req.params;
	let connection;

	try {
		connection = await connectDB();
		const tasks = await Task.getTasksByOrderDetail(connection, orderDetailId);
		const status = await Task.getOrderDetailStatus(connection, orderDetailId);

		res.status(200).json({
			tasks: tasks,
			orderDetailStatus: status,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};
