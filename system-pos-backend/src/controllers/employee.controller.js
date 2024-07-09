import { connectDB } from '../config/database.js';
import Employee from '../models/employee.model.js';

export const registerEmployee= async(req, res, next) => {
    const { id, name, role, email, phone, address } = req.body;

	let connection;

	try {
		connection = await connectDB();

		const existingEmployee = await Employee.findById(connection, id);

		if (existingEmployee) {
			return res.status(400).json({ error: 'El número de identificación ya está en uso' });
		}

		await Employee.create(connection, { id, name, role, email, phone, address });

		res.status(201).json({
			message: 'Empleado registrador exitosamente',
			employee: { id, name, role, email, phone, address },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
}


export const getEmployees = async (req, res, next) => {
	let connection;

	try {
		connection = await connectDB();

		const employees = await Employee.findAll(connection);

		res.status(200).json(employees);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const updateEmployee = async (req, res, next) => {
	const { id, name, role, email, phone, address } = req.body;

	let connection;

	try {
		connection = await connectDB();

		await Employee.update(connection, { id, name, role, email, phone, address });

		res.status(200).json({
			message: 'Empleado actualizado exitosamente',
			employee: { id, name, role, email, phone, address },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};


export const deleteEmployee = async (req, res, next) => {
	const { id } = req.params;
	let connection;
	try {
		connection = await connectDB();
		await Employee.delete(connection, id);
		res.status(200).json({ message: 'Empleado eliminado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};