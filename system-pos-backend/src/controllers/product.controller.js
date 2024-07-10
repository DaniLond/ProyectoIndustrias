import { connectDB } from '../config/database.js';

import Product from '../models/product.model.js';

export const getProducts = async (req, res, next) => {
	let connection;

	try {
		connection = await connectDB();

		const products = await Product.findAll(connection);

		res.status(200).json(products);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getProduct = async (req, res, next) => {
	const { name } = req.params;

	let connection;
	try {
		connection = await connectDB();
		const product = await Product.findById(connection, name);

		if (!product) {
			return res.status(404).json({ error: 'Producto no encontrado' });
		}

		res.status(200).json(product);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const createProduct = async (req, res, next) => {
	const {
		name,
		wood_cut_price,
		fabric_cut_price,
		sewing_price,
		upholsterer_price,
		assembled_price,
		sales_price,
		image_route,
	} = req.body;

	let connection;
	try {
		connection = await connectDB();
		const existingProduct = await Product.findById(connection, name);

		if (existingProduct) {
			return res.status(400).json({ error: 'El nombre del producto ya está en uso' });
		}

		await Product.create(connection, {
			name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			upholsterer_price,
			assembled_price,
			sales_price,
			image_route,
		});

		res.status(201).json({ message: 'Producto creado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const updateProduct = async (req, res, next) => {
	const { name } = req.params;
	const {
		name: new_name,
		wood_cut_price,
		fabric_cut_price,
		sewing_price,
		upholsterer_price,
		assembled_price,
		sales_price,
		image_route,
	} = req.body;

	let connection;
	try {
		connection = await connectDB();
		await Product.update(connection, {
			name,
			new_name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			upholsterer_price,
			assembled_price,
			sales_price,
			image_route,
		});

		res.status(200).json({ message: 'Producto actualizado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const deleteProduct = async (req, res, next) => {
	const { name } = req.params;

	let connection;
	try {
		connection = await connectDB();

		await Product.delete(connection, name);

		res.status(200).json({ message: 'Producto eliminado exitosamente' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};
