"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../utils/enums");
const constantes_1 = require("../utils/constantes");
// Función para obtener los periodos según el tipo de archivo
const getValidPeriods = (typeFile) => {
    if (typeFile === enums_1.Certificate.CERTIFICADO_RETENCION_IVA || typeFile === enums_1.Certificate.CERTIFICADO_INDUSTRIA_COMERCIO)
        return ["Todos", ...constantes_1.bimesters];
    if (typeFile === enums_1.Certificate.CERTIFICADO_RETENCION_FUENTE_RTE)
        return ["Todos", ...constantes_1.month];
    return [];
};
// Esquema base
exports.certificateSchema = zod_1.z.object({
    nit: zod_1.z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.' })
        .min(100000, { message: 'NIT inválido' })
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    year: zod_1.z.
        number({ invalid_type_error: 'El año debe ser un numero, no otro tipo de dato.' })
        .int()
        .min(2000, { message: 'El año debe ser mayor a 2000.' }),
    typeFile: zod_1.z
        .nativeEnum(enums_1.Certificate, {
        required_error: 'El tipo de certificado es obligatorio.'
    }),
    period: zod_1.z.string()
}).superRefine((data, ctx) => {
    const validPeriods = getValidPeriods(data.typeFile);
    if (!validPeriods.includes(data.period)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `Período inválido. Los valores permitidos para ${data.typeFile} son: ${validPeriods.join(", ")}`
        });
    }
});
