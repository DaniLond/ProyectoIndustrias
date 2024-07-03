import { z } from 'zod';

const nameSchema = z
	.string({ required_error: 'Nombre del producto es obligatorio' })
	.min(3, { message: 'El nombre del producto debe tener un mínimo de 3 caracteres' })
	.max(100, { message: 'El nombre del producto no puede exceder los 100 caracteres' })
	.trim();

export const createProductSchema = z.object({
	name: nameSchema,
});
