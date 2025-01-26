import { z } from 'zod';

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
            .min(1, { message: 'El ID de la empresa debe ser al menos 1.' })  // Solo es necesario esto para validar el mínimo permitido
});

export type TFilesExcelsSchema = z.infer<typeof filesExcelsSchema>;
