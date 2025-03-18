"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordUpdateWithoutNit = exports.updatePasswordSchema = exports.baseSchemaPasswordUpdated = void 0;
const zod_1 = require("zod");
exports.baseSchemaPasswordUpdated = zod_1.z.object({
    nit: zod_1.z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.' })
        .min(100000, { message: 'NIT inválido' })
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    newPassword: zod_1.z
        .string({ invalid_type_error: 'La contraseña debe ser un texto, no otro tipo de dato.' })
        .min(8, { message: 'Contraseña muy corta' })
        .max(255, { message: 'La contraseña no puede excerderse más de 100 caracteres' }),
    password: zod_1.z
        .string({ invalid_type_error: 'La contraseña debe ser un texto, no otro tipo de dato.' })
        .min(8, { message: 'Contraseña muy corta' })
        .max(255, { message: 'La contraseña no puede excerderse más de 100 caracteres' }),
});
exports.updatePasswordSchema = exports.baseSchemaPasswordUpdated.refine((data) => data.newPassword === data.password, {
    message: 'Las contraseñas no coinciden',
    path: ["confirmPassword"],
});
exports.updatePasswordUpdateWithoutNit = exports.baseSchemaPasswordUpdated
    .extend({
    nit: exports.baseSchemaPasswordUpdated.shape.nit.optional(),
})
    .refine((data) => data.newPassword === data.password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});
