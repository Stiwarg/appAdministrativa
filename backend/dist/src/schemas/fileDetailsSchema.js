"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesDetailsShema = void 0;
const zod_1 = require("zod");
exports.filesDetailsShema = zod_1.z.object({
    tpRete: zod_1.z
        .number({ invalid_type_error: 'El tpRete debe ser un numero, no otro tipo de dato.' })
        .int()
        .min(0, { message: 'El tipo de retención es obligatorio.' }),
    nitRegister: zod_1.z
        .number({ invalid_type_error: 'El nit debe ser un numero, no otro tipo de dato.' })
        .int()
        .min(100000, { message: 'El NIT es obligatorio.' }),
    dv: zod_1.z
        .number({ invalid_type_error: 'El dv debe ser un numero, no otro tipo de dato.' })
        .int()
        .min(0, { message: 'El dígito de verificación debe ser mayor o igual a 0' }),
    nameCompany: zod_1.z
        .string({ invalid_type_error: 'La razon social  debe ser un texto, no otro tipo de dato.' })
        .nonempty({ message: 'El nombre de la empresa es obligatorio.' }),
    nameConcept: zod_1.z
        .string({ invalid_type_error: 'El nombre concepto en certificado debe ser un numero, no otro tipo de dato.' })
        .nonempty({ message: 'El nombre del concepto es obligatorio.' }),
    base: zod_1.z
        .number({ invalid_type_error: 'La base debe ser un numero, no otro tipo de dato.' })
        .min(0, { message: 'La base debe ser un número positivo.' }),
    valueRetained: zod_1.z
        .number({ invalid_type_error: 'El valor retenido debe ser un numero, no otro tipo de dato ' })
        .min(0, { message: 'El valor retenido debe ser número positivo.' }),
    percentage: zod_1.z
        .number({ invalid_type_error: 'El porcentaje debe ser un numero, no otro tipo de dato ' })
});
