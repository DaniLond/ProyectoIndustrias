import jwt from 'jsonwebtoken';
import { TOKEN_SECRET, JWT_EXPIRATION } from '../config.js';

export async function createAccessToken(payload) {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, TOKEN_SECRET, { expiresIn: JWT_EXPIRATION }, (err, token) => {
			if (err) reject(err);
			resolve(token);
		});
	});
}
