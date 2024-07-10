import { connectDB } from '../config/database.js';
import Client from '../models/client.model.js';

export const registerClient = async (req, res, next) => {
	const { id, client_name, email, phone, address, city } = req.body;

	let connection;

	try {
		connection = await connectDB();

		const existingClient = await Client.findById(connection, id);

		if (existingClient) {
			return res.status(400).json({ error: 'El número de identificación ya está en uso' });
		}

		await Client.create(connection, { id, client_name, email, phone, address, city });

		res.status(201).json({
			message: 'Cliente registrador exitosamente',
			client: { id, client_name, email, phone, address, city },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getClients = async (req, res, next) => {
	let connection;

	try {
		connection = await connectDB();

		const clients = await Client.findAll(connection);

		res.status(200).json(clients);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const updateClient = async (req, res, next) => {
	const { id, client_name, email, phone, address, city } = req.body;

	let connection;

	try {
		connection = await connectDB();

		await Client.update(connection, { id, client_name, email, phone, address, city });

		res.status(200).json({
			message: 'Cliente actualizado exitosamente',
			client: { id, client_name, email, phone, address, city },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const deleteClient = async (req, res, next) => {
	const { id } = req.params;
	let connection;
	try {
		connection = await connectDB();
		await Client.delete(connection, id);
		res.status(200).json({ message: 'Cliente eliminado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};
