import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from './db.js';

async function main() {
	try {
		await connectDB();
		app.listen(PORT);
		console.log(`El servidor esta corriendo en puerto http://localhost:${PORT}`);
	} catch (error) {
		console.error(error);
	}
}

main();
