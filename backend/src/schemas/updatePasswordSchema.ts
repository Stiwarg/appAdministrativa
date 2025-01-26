import { z } from 'zod';

export const baseSchemaPasswordUpdated = z.object({
    nit: z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.'})
        .min( 100000, { message: 'NIT inválido'})
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    newPassword: z
        .string({ invalid_type_error: 'La contraseña debe ser un texto, no otro tipo de dato.' })
        .min( 8, { message: 'Contraseña muy corta' })
        .max( 255, { message: 'La contraseña no puede excerderse más de 100 caracteres'}),
    password: z
        .string({ invalid_type_error: 'La contraseña debe ser un texto, no otro tipo de dato.' })
        .min( 8, { message: 'Contraseña muy corta' })
        .max( 255, { message: 'La contraseña no puede excerderse más de 100 caracteres'}),
});

export const updatePasswordSchema = baseSchemaPasswordUpdated.refine(
    ( data ) => data.newPassword === data.password, {
        message: 'Las contraseñas no coinciden',
        path: ["confirmPassword"],
    }
)

export const updatePasswordUpdateWithoutNit = baseSchemaPasswordUpdated
    .extend({
        nit: baseSchemaPasswordUpdated.shape.nit.optional(),
    })
    .refine( ( data ) => data.newPassword === data.password, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    }
);
