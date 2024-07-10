import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middlewares/cors.js';

const app = express();

// Middlewares
app.use(morgan('dev')); // Middleware para ver solicitudes HTTP por consola
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(corsMiddleware); // Middleware para tratar el CORS
app.use(cookieParser()); // Middleware para manejar las cookies que se envían desde el cliente hasta el servidor

// Importa las rutas
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import clientRoutes from './routes/client.routes.js';
import employeeRoutes from './routes/employee.routes.js';

// Configuración de las rutas
app.use(authRoutes);
app.use(productRoutes);
app.use(clientRoutes);
app.use(employeeRoutes);

export default app;
