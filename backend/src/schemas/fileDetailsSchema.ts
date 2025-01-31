import { z } from 'zod';

export const filesDetailsShema = z.object({
    tpRete: z
            .number({ invalid_type_error: 'El tpRete debe ser un numero, no otro tipo de dato.'})
            .int()
            .min(0, { message: 'El tipo de retención es obligatorio.' }),
    nitRegister: z
            .number({ invalid_type_error: 'El nit debe ser un numero, no otro tipo de dato.'})
            .int()
            .min(100000, { message: 'El NIT es obligatorio.' }),
    dv: z
        .number({ invalid_type_error: 'El dv debe ser un numero, no otro tipo de dato.'})
        .int()
        .min(0, { message: 'El dígito de verificación debe ser mayor o igual a 0' }),
    nameCompany: z
                .string({ invalid_type_error: 'La razon social  debe ser un texto, no otro tipo de dato.'})
                .nonempty({ message: 'El nombre de la empresa es obligatorio.' }),
    nameConcept: z
                .string({ invalid_type_error: 'El nombre concepto en certificado debe ser un numero, no otro tipo de dato.'})
                .nonempty({ message: 'El nombre del concepto es obligatorio.' }),
    base: z
        .number({ invalid_type_error: 'La base debe ser un numero, no otro tipo de dato.'})
        .min(0, { message: 'La base debe ser un número positivo.' }),
    valueRetained: z
                .number({ invalid_type_error: 'El valor retenido debe ser un numero, no otro tipo de dato '})
                .min(0, { message: 'El valor retenido debe ser número positivo.' }),
    percentage: z
                .number({ invalid_type_error: 'El porcentaje debe ser un numero, no otro tipo de dato '})
});