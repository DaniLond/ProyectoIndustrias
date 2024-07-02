import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../config/database.js';
import { SALT_ROUNDS, TOKEN_SECRET, RESET_PASSWORD_TOKEN_EXPIRATION, FRONTEND_URL } from '../config.js';
import { createAccessToken } from '../libs/jwt.js';
import { sendMail } from '../libs/email.js';

import User from '../models/user.model.js';

export const register = async (req, res, next) => {
	const { id, username, password, email } = req.body;

	let connection;
	try {
		connection = await connectDB();
		const existingUser = await User.findById(connection, id);

		if (existingUser) {
			return res.status(400).json({ error: 'El número de identificación ya está en uso' });
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		await User.create(connection, { id, username, password: hashedPassword, email });

		const token = await createAccessToken({ id, username });
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		});
		res.status(201).json({
			message: 'Usuario registrado exitosamente',
			user: { id, username, email },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const login = async (req, res, next) => {
	const { id, password } = req.body;

	let connection;
	try {
		connection = await connectDB();
		const user = await User.findById(connection, id);

		if (!user) {
			return res.status(400).json({ error: 'Usuario no encontrado' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ error: 'Contraseña incorrecta' });
		}

		const token = await createAccessToken({ id: user.id, username: user.username });
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		});
		res.status(200).json({
			message: 'Inicio de sesión exitoso',
			user: { id: user.id, username: user.username, email: user.email },
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const logout = async (req, res) => {
	res.cookie('token', '', {
		expires: new Date(0),
	});
	return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
	const { token } = req.cookies;
	if (!token) return res.status(401).json({ error: 'Acceso denegado, no se proporciona ningún token' });

	jwt.verify(token, TOKEN_SECRET, async (error, user) => {
		if (error) return res.status(401).json({ error: 'Acceso denegado, token no valido' });

		let connection;
		try {
			connection = await connectDB();
			const userFound = await User.findById(connection, user.id);

			if (!userFound) return res.status(401).json({ error: 'Acceso denegado, token no valido' });

			return res.json({
				id: userFound._id,
				username: userFound.username,
				email: userFound.email,
			});
		} catch (error) {
			res.status(500).json({ error: 'Error validando el token' });
			console.error('Error validando el token:', error);
		}
	});
};

export const forgotPassword = async (req, res, next) => {
	const { id } = req.body;

	console.log(req.get('host'));

	let connection;
	try {
		connection = await connectDB();
		const user = await User.findById(connection, id);

		if (!user) {
			return res.status(400).json({ error: 'Usuario no encontrado' });
		}

		const token = jwt.sign({ id: user.id }, TOKEN_SECRET, { expiresIn: RESET_PASSWORD_TOKEN_EXPIRATION });

		const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

		await sendMail('email-password', user.email, 'Recuperación de Contraseña', { resetLink });

		res.status(200).json({ message: 'Enlace para restablecer contraseña enviado a su cuenta de correo electrónico' });
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const resetPassword = async (req, res, next) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		const decoded = jwt.verify(token, TOKEN_SECRET);
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		let connection;
		try {
			connection = await connectDB();
			await User.resetPassword(connection, hashedPassword, decoded.id);

			res.status(200).json({ message: 'La contraseña se ha restablecido correctamente' });
		} catch (error) {
			next(error);
		} finally {
			if (connection) connection.release();
		}
	} catch (error) {
		res.status(400).json({ error: 'Token no valido o expirado' });
	}
};
