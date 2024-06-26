import bcrypt from 'bcryptjs';
import { connectDB } from '../db.js';
import { SALT_ROUNDS } from '../config.js';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
	const { id, username, password, email } = req.body;
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	try {
		const connection = await connectDB();
		await connection.query('INSERT INTO USERS (id, username, password, email) VALUES (?, ?, ?, ?);', [
			id,
			username,
			hashedPassword,
			email,
		]);

		const token = await createAccessToken({ id: id, username: username });
		res.cookie('token', token);
		res.status(201).json({
			message: 'Usuario registrado exitosamente',
			user: { id, username, email },
		});
	} catch (error) {
		res.status(500).send({ error: 'Error registrando el usuario' });
		console.error('Error registrando el usuario:', error);
	}
};

export const login = async (req, res) => {
	const { id, password } = req.body;

	try {
		const connection = await connectDB();
		const [rows] = await connection.query('SELECT * FROM USERS WHERE id = ?;', [id]);

		if (rows.length === 0) {
			return res.status(400).send({ error: 'Usuario no encontrado' });
		}

		const user = rows[0];
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).send({ error: 'Contraseña incorrecta' });
		}

		const token = await createAccessToken({ id: user.id, username: user.username });
		res.cookie('token', token);
		res.status(200).json({
			message: 'Inicio de sesión exitoso',
			user: { id: user.id, username: user.username, email: user.email },
		});
	} catch (error) {
		res.status(500).send({ error: 'Error al iniciar sesión' });
		console.error('Error al iniciar sesión:', error);
	}
};
