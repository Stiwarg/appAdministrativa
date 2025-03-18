"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaWithNit = exports.userSchemaWithoutRol = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
// Esquema para la validación del cuerpo de la solicitud al registrar un usuario
exports.userCreateSchema = zod_1.z.object({
    nit: zod_1.z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.' })
        .min(100000, { message: 'El NIT debe ser mayor o igual a 100000' })
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .max(255, { message: 'La contraseña no puede tener más de 100 caracteres' }),
    companyId: zod_1.z
        .number()
        .int({ message: 'El ID de la compañia debe ser un número entero positivo' }),
    rolId: zod_1.z
        .number()
        .int({ message: 'El ID de la compañia debe ser un número entero positivo' }),
});
// Nuevo esquema excluyendo el rolId
exports.userSchemaWithoutRol = exports.userCreateSchema.extend({
    rolId: exports.userCreateSchema.shape.rolId.optional(),
});
exports.userSchemaWithNit = exports.userCreateSchema.extend({
    rolId: exports.userCreateSchema.shape.rolId.optional(),
    companyId: exports.userCreateSchema.shape.companyId.optional(),
    password: exports.userCreateSchema.shape.password.optional(),
});
//const userSchemaWithoutRol2 = userCreateSchema.omit({ rolId: true });
//export type TUserWithoutRoleId = z.infer<typeof userSchemaWithoutRol2>;
