import { z } from 'zod';

export const paymentCreateSchema = z.object({
	employeeId: z.string().min(1, 'El ID del empleado es requerido'),
	baseAmount: z.number().int().min(0, 'El monto base debe ser mayor o igual a 0'),
	paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'La fecha debe tener un formato válido'),
	additionalConcepts: z
		.array(
			z.object({
				concept_id: z.number().int().optional(),
				name: z.string().min(1, 'El nombre del concepto es requerido').optional(),
				value: z.number().int('El valor debe ser un número entero'),
			}),
		)
		.optional()
		.default([]),
});

export const conceptCreateSchema = z.object({
	conceptName: z
		.string()
		.min(1, 'El nombre del concepto es requerido')
		.max(100, 'El nombre no puede exceder 100 caracteres'),
	value: z.number().int('El valor debe ser un número entero'),
});

export const paginationSchema = z.object({
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val) : 50)),
	offset: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val) : 0)),
});
