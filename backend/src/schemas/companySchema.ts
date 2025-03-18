import { z } from 'zod';
// id, nameCompany, logo, createdAt, updatedAt
export const companyCreateSchema = z.object({
    nameCompany: z
        .string({ invalid_type_error: 'El nombre de la compañia debe ser un texto, no otro tipo de dato.'})
        .min( 1, { message: 'El nombre de la compañia debe tener al menos 1 caracter' })
        .max( 200, { message: 'El nombre de la compañia no puede tener más de 200 caracteres'})
        .regex(/^[a-zA-Z0-9Ññ]([a-zA-Z0-9Ññ\s.,'()-]*(?:[ &]+[a-zA-Z0-9Ññ\s.,'()-]+)*)?$/, { message: 'El nombre de la compañia contiene caracteres no permitidos.'})
        .trim()
        .toLowerCase(),
        //.regex(/^[a-zA-Z0-9][a-zA-Z0-9\s.,'()-]+(?:[ &]+[a-zA-Z0-9\s.,'()-]+)*$/, { message: 'El nombre de la compañia contiene caracteres no permitidos.'}),
    logo: z
        .string()
        .regex(/^(\/uploads\/logos\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png))$/i, { message: 'El logo debe ser una ruta válida en formato (jpeg, jpg, png o svg)' })
        .max(255, { message: 'La ruta del logo no puede superar los 255 caracteres.'})
        .optional(),
});

export type TCompanyFromSchema = z.infer< typeof companyCreateSchema >;