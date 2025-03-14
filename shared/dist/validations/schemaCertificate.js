import { z } from 'zod';
import { Certificate } from './utils/enums.js';
import { month, bimesters } from './utils/constantes.js';
// Función para obtener los periodos según el tipo de archivo
const getValidPeriods = (typeFile) => {
    if (typeFile === Certificate.CERTIFICADO_RETENCION_IVA || typeFile === Certificate.CERTIFICADO_INDUSTRIA_COMERCIO)
        return ["Todos", ...bimesters];
    if (typeFile === Certificate.CERTIFICADO_RETENCION_FUENTE_RTE)
        return ["Todos", ...month];
    return [];
};
// Esquema base
export const certificateSchema = z.object({
    nit: z
        .number({ invalid_type_error: 'El NIT debe ser un número, no una cadena de texto. Por favor, ingresa solo números.' })
        .min(100000, { message: 'NIT inválido' })
        .positive({ message: 'El NIT debe ser un numero entero positivo' }),
    year: z.
        number({ invalid_type_error: 'El año debe ser un numero, no otro tipo de dato.' })
        .int()
        .min(2000, { message: 'El año debe ser mayor a 2000.' }),
    typeFile: z
        .nativeEnum(Certificate, {
        required_error: 'El tipo de certificado es obligatorio.'
    }),
    period: z.string()
}).superRefine((data, ctx) => {
    const validPeriods = getValidPeriods(data.typeFile);
    if (!validPeriods.includes(data.period)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Período inválido. Los valores permitidos para ${data.typeFile} son: ${validPeriods.join(", ")}`
        });
    }
});
