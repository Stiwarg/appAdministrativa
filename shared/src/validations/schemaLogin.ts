import { z } from 'zod';

export const loginSchema = z.object({
    nit: z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.'})
        .min( 100000, { message: 'NIT inválido'})
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    password: z
        .string({ invalid_type_error: 'La contraseña debe ser un texto, no otro tipo de dato.' })
        .min( 8, { message: 'Contraseña muy corta' })
        .max( 255, { message: 'La contraseña no puede excerderse más de 100 caracteres'})
});

export type TLoginSchema = z.infer< typeof loginSchema >;