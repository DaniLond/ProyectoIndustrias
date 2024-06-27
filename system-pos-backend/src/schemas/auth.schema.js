import { z } from 'zod';

export const registerSchema = z.object({
	id: z
		.string({ required_error: 'Cédula es obligatoria' })
		.min(3, { message: 'La cédula debe tener un mínimo de 3 caracteres' })
		.max(255, { message: 'La cédula no puede exceder los 20 caracteres' })
		.trim(),
	username: z
		.string({ required_error: 'Nombre de usuario es obligatorio' })
		.min(3, { message: 'El nombre de usuario debe tener un mínimo de 3 caracteres' })
		.max(255, { message: 'El nombre de usuario no puede exceder los 255 caracteres' })
		.trim(),
	password: z
		.string({ required_error: 'Contraseña es obligatoria' })
		.min(6, { message: 'La contraseña debe tener un mínimo de 6 caracteres' })
		.max(255, { message: 'La contraseña no puede exceder los 255 caracteres' }),
	email: z
		.string({ required_error: 'Correo electrónico es obligatorio' })
		.email({ message: 'Correo electrónico inválido' })
		.max(255, { message: 'El correo electrónico no puede exceder los 255 caracteres' })
		.trim(),
});

export const loginSchema = z.object({
	id: z
		.number({ required_error: 'Cédula es obligatoria' })
		.int({ message: 'Cédula debe ser un número entero' })
		.positive(),
	password: z
		.string({ required_error: 'Contraseña es obligatoria' })
		.min(6, { message: 'La contraseña debe tener un mínimo de 6 caracteres' })
		.max(255, { message: 'La contraseña no puede exceder los 255 caracteres' }),
});
