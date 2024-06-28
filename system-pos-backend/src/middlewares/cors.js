import cors from 'cors';
import { ACCEPTED_ORIGINS } from '../config.js';

const corsOptions = {
	credentials: true,
	origin: (origin, callback) => {
		if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('No permitido por CORS'));
		}
	},
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
