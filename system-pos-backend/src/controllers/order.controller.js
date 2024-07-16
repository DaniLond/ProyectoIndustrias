import { connectDB } from '../config/database.js';

import Order from '../models/order.model.js';

export const getOrders = async (req, res, next) => {
	let connection;

	try {
		connection = await connectDB();

		const orders = await Order.findAll(connection);

		res.status(200).json(orders);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getOrderById = async (req, res, next) => {
	const { id } = req.params;
	let connection;

	try {
		connection = await connectDB();

		const order = await Order.findById(connection, id);

		if (!order) {
			return res.status(404).json({ error: 'Orden no encontrada' });
		}

		res.status(200).json(order);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getProductToOrder = async (req, res, next) => {
    const { id } = req.params;
	let connection;

	try {
		connection = await connectDB();

		const product = await Order.findProductsByOrderId(connection, id);

		res.status(200).json(product);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const createOrder = async (req, res, next) => {
	const { detail, client, delivery_date, address, products } = req.body;

	let connection;

	try {
		connection = await connectDB();

		await Order.create(connection, { detail, client, delivery_date, address, products });

		res.status(201).json({
			message: 'Orden creada exitosamente',
			order: { detail, client, delivery_date, address, products },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const updateOrder = async (req, res, next) => {
	const { id, detail, delivery_date, address, id_state, productsToUpdate } = req.body;

	let connection;

	try {
		connection = await connectDB();

		await Order.update(connection, { id, detail, delivery_date, address, id_state, productsToUpdate });

		res.status(200).json({
			message: 'Orden actualizada exitosamente',
			order: { id, detail, delivery_date, address, id_state, productsToUpdate },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const deleteProductFromOrder = async (req, res, next) => {
	const { id } = req.params;
	let connection;

	try {
		connection = await connectDB();
		await Order.deleteProductFromOrder(connection, id);
		res.status(200).json({ message: 'Producto eliminada exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};
