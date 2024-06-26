import bcrypt from 'bcryptjs';
import { connectDB } from '../db.js';

export const register = async (req, res) => {
	const { id, username, password, email } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const connection = await connectDB();
		await connection.query('INSERT INTO USERS (id, username, password, email) VALUES (?, ?, ?, ?);', [
			id,
			username,
			hashedPassword,
			email,
		]);

		res.status(201).send({ message: 'Usuario registrado exitosamente' });
	} catch (error) {
		res.status(500).send({ error: 'Error registrando el usuario' });
		console.error(error);
	}
};

export const login = (req, res) => {
	res.send('login');
};
