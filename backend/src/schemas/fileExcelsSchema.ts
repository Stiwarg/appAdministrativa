import { z } from 'zod';
import { TypeFile, TypePeriod } from '../utils/enums';
import { bimesters, month } from '../utils/constantes';

export const filesExcelsSchema = z.object({
        nameFile: z
            .string({ required_error: 'El nombre del archivo es obligatorio.'})
            .regex(/^(\/uploads\/excels\/[0-9]+_(IVA|ICA|RTE).*\.(xlsx|xls))$/i, 
            { message: 'El nombre del archivo debe comenzar con IVA, ICA o RTE seguido de texto, números, rayas o espacios, y terminar con .xlsx o .xls.' })
            .nonempty("El nombre del archivo no puede estar vacío"),  // Esto es suficiente para validar que no sea vacío
        empresaId: z
            .coerce.number({ required_error: 'El ID de la empresa es obligatorio.'})
            .int({ message: 'El valor debe ser un entero.' })
            .positive({ message: 'El ID de la empresa debe ser un valor positivo.' })
            .min(1, { message: 'El ID de la empresa debe ser al menos 1.' }),  // Solo es necesario esto para validar el mínimo permitido
        period: z
                .nativeEnum( TypePeriod, {
                        required_error: 'El periodo es obligatorio.',
                        invalid_type_error: 'El periodo debe ser un valor válido.'
                }),
        typeFile: z
                .nativeEnum( TypeFile, {
                        required_error: 'El tipo de archivo es obligatorio.'
                }),
})
.superRefine( ( data, ctx ) => {
        // Periodos válidos para cadito de archivo 

        // Validación dinámica con Zod 
        if(( data.typeFile === TypeFile.ICA || data.typeFile === TypeFile.IVA ) && !bimesters.includes( data.period )){
                ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["period"],
                        message: `El tipo de archivo ${ data.typeFile } solo permite periodos bimestrales.`
                });
        }

        if ( data.typeFile === TypeFile.RTE && !month.includes( data.period )) {
                ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['period'],
                        message: `El tipo de archivo RTE solo permite períodos mensuales.`
                });
        }
});

export type TFilesExcelsSchema = z.infer<typeof filesExcelsSchema>;
