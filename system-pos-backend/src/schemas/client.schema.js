import { z } from 'zod';

const idSchema = z
	.string({ required_error: 'Cédula es obligatoria' })
	.min(3, { message: 'La cédula debe tener un mínimo de 3 caracteres' })
	.max(20, { message: 'La cédula no puede exceder los 20 caracteres' })
	.regex(/^\d+$/, { message: 'La cédula solo puede contener dígitos' })
	.trim();

const nameSchema = z
	.string({ required_error: 'Nombre es obligatorio' })
	.min(3, { message: 'El nombre debe tener un mínimo de 3 caracteres' })
	.max(80, { message: 'El nombre no puede exceder los 80 caracteres' })
	.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
	.trim();

const emailSchema = z
	.email({ message: 'Correo electrónico inválido' })
	.max(100, { message: 'El correo electrónico no puede exceder los 100 caracteres' })
	.trim();

const phoneSchema = z
	.min(7, { message: 'El teléfono debe tener un mínimo de 7 caracteres' })
	.max(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
	.regex(/^\+?[\d\s-]+$/, { message: 'Formato de teléfono inválido' })
	.trim();

const addressSchema = z
	.min(5, { message: 'La dirección debe tener un mínimo de 5 caracteres' })
	.max(255, { message: 'La dirección no puede exceder los 255 caracteres' })
	.trim();

const citySchema = z
	.min(3, { message: 'La ciudad debe tener un mínimo de 2 caracteres' })
	.max(50, { message: 'La ciudad no puede exceder los 50 caracteres' })
	.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'La ciudad solo puede contener letras y espacios' })
	.trim();

export const clienteRegisterSchema = z.object({
	id: idSchema,
	name: nameSchema,
	email: emailSchema,
	phone: phoneSchema,
	address: addressSchema,
	city: citySchema,
});

export const clienteUpdateSchema = z
	.object({
		id: idSchema.optional(),
		name: nameSchema.optional(),
		email: emailSchema.optional(),
		phone: phoneSchema.optional(),
		address: addressSchema.optional(),
		city: citySchema.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'Al menos un campo debe ser proporcionado para la actualización',
	});
