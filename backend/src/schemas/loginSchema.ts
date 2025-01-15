import { z } from 'zod';

export const loginSchema = z.object({
    nit: z
    .number().min( 100000, { message: 'NIT inválido'})
    .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    password: z
        .string()
        .min( 8, { message: 'Contraseña muy corta' })
        .max( 255, { message: 'La contraseña no puede excerderse más de 100 caracteres'})
});