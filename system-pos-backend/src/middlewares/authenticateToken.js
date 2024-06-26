import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authenticateToken = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) return res.status(401).json({ message: 'Acceso denegado, no se proporciona ningún token' });

	try {
		const decoded = jwt.verify(token, TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).send({ error: 'Token no valido' });
	}
};
