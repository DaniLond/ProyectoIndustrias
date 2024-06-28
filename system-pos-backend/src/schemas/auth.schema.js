import { z } from 'zod';

const idSchema = z
	.string({ required_error: 'Número de identificación es obligatorio' })
	.min(3, { message: 'El número de identificación debe tener un mínimo de 3 caracteres' })
	.max(20, { message: 'El número de identificación no puede exceder los 20 caracteres' })
	.regex(/^\d+$/, { message: 'El número de identificación solo puede contener dígitos' })
	.trim();

const usernameSchema = z
	.string({ required_error: 'Nombre de usuario es obligatorio' })
	.min(3, { message: 'El nombre de usuario debe tener un mínimo de 3 caracteres' })
	.max(255, { message: 'El nombre de usuario no puede exceder los 255 caracteres' })
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' })
	.trim();

const passwordSchema = z
	.string({ required_error: 'Contraseña es obligatoria' })
	.min(6, { message: 'La contraseña debe tener un mínimo de 6 caracteres' })
	.max(255, { message: 'La contraseña no puede exceder los 255 caracteres' });

const emailSchema = z
	.string({ required_error: 'Correo electrónico es obligatorio' })
	.email({ message: 'Correo electrónico inválido' })
	.max(255, { message: 'El correo electrónico no puede exceder los 255 caracteres' })
	.trim();

export const registerSchema = z.object({
	id: idSchema,
	username: usernameSchema,
	password: passwordSchema,
	email: emailSchema,
});

export const loginSchema = z.object({
	id: idSchema,
	password: passwordSchema,
});
