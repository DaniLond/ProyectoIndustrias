import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authenticateToken = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) return res.status(401).json({ error: 'Acceso denegado, no se proporciona ningún token' });

	try {
		const decoded = jwt.verify(token, TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'El token ha expirado' });
		} else if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Token no válido' });
		} else {
			return res.status(500).json({ error: 'Error en la autenticación del token' });
		}
	}
};
