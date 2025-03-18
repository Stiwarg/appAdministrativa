"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesExcelsSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../utils/enums");
const constantes_1 = require("../utils/constantes");
exports.filesExcelsSchema = zod_1.z.object({
    nameFile: zod_1.z
        .string({ required_error: 'El nombre del archivo es obligatorio.' })
        .regex(/^(\/uploads\/excels\/[0-9]+_(IVA|ICA|RTE).*\.(xlsx|xls))$/i, { message: 'El nombre del archivo debe comenzar con IVA, ICA o RTE seguido de texto, números, rayas o espacios, y terminar con .xlsx o .xls.' })
        .nonempty("El nombre del archivo no puede estar vacío"), // Esto es suficiente para validar que no sea vacío
    empresaId: zod_1.z
        .coerce.number({ required_error: 'El ID de la empresa es obligatorio.' })
        .int({ message: 'El valor debe ser un entero.' })
        .positive({ message: 'El ID de la empresa debe ser un valor positivo.' })
        .min(1, { message: 'El ID de la empresa debe ser al menos 1.' }), // Solo es necesario esto para validar el mínimo permitido
    typeFile: zod_1.z
        .nativeEnum(enums_1.TypeFile, {
        required_error: 'El tipo de archivo es obligatorio.'
    }),
    period: zod_1.z
        .nativeEnum(enums_1.TypePeriod, {
        required_error: 'El periodo es obligatorio.',
        invalid_type_error: 'El periodo debe ser un valor válido.'
    }),
    year: zod_1.z.
        coerce.number({ required_error: 'El año es obligatorio' })
        .int({ message: 'El valor debe ser un entero' })
        .positive({ message: 'El año debe ser un valor positivo' })
        .min(2000, { message: 'El año debe ser mayor o igual a 2000.' }),
})
    .superRefine((data, ctx) => {
    // Periodos válidos para cadito de archivo 
    // Validación dinámica con Zod 
    if ((data.typeFile === enums_1.TypeFile.ICA || data.typeFile === enums_1.TypeFile.IVA) && !constantes_1.bimesters.includes(data.period)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["period"],
            message: `El tipo de archivo ${data.typeFile} solo permite periodos bimestrales.`
        });
    }
    if (data.typeFile === enums_1.TypeFile.RTE && !constantes_1.month.includes(data.period)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['period'],
            message: `El tipo de archivo RTE solo permite períodos mensuales.`
        });
    }
});
