import { z } from 'zod';

// Esquema para la validación del cuerpo de la solicitud al registrar un usuario
export const userCreateSchema = z.object({
    nit: z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.'})
        .min( 100000, { message: 'El NIT debe ser mayor o igual a 100000'} )
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    password: z
        .string()
        .min( 8, { message: 'La contraseña debe tener al menos 8 caracteres'})
        .max( 255, { message: 'La contraseña no puede tener más de 100 caracteres'}),
    companyId: z
        .number()
        .int({ message: 'El ID de la compañia debe ser un número entero positivo' }),    
    rolId: z
        .number()
        .int({ message: 'El ID de la compañia debe ser un número entero positivo' }),
});

// Nuevo esquema excluyendo el rolId
export const userSchemaWithoutRol = userCreateSchema.extend({
    rolId: userCreateSchema.shape.rolId.optional(),
});

export const userSchemaWithNit = userCreateSchema.extend({
    rolId: userCreateSchema.shape.rolId.optional(),
    companyId: userCreateSchema.shape.companyId.optional(),
    password: userCreateSchema.shape.password.optional(),
});

// Tipo basado en el esquema original
export type TUserFromSchema = z.infer< typeof userCreateSchema >;
// Tipo basado en el esquema sin rolId
export type TUserWithoutRol = z.infer< typeof userSchemaWithoutRol >;

//const userSchemaWithoutRol2 = userCreateSchema.omit({ rolId: true });
//export type TUserWithoutRoleId = z.infer<typeof userSchemaWithoutRol2>;
