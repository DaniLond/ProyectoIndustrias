import { z } from 'zod';
import { idSchema, clientNameSchema, emailSchema, phoneSchema, addressSchema } from './client.schema.js';

const roleSchema = z
    .string({ required_error: 'Rol es obligatorio' })
    .min(5, { message: 'El rol debe tener un mínimo de 5 caracteres' })
    .max(50, { message: 'El rol no puede exceder los 50 caracteres' })
    .trim();

export const employeeRegisterSchema = z.object({
    id: idSchema,
    name: clientNameSchema,
    role: roleSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
});

export const employeeUpdateSchema = z
    .object({
        id: idSchema.optional(),
        name: clientNameSchema.optional(),
        role: roleSchema.optional(),
        email: emailSchema.optional(),
        phone: phoneSchema.optional(),
        address: addressSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Al menos un campo debe ser proporcionado para la actualización',
    });
