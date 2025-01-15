import { z } from 'zod';
// id, nameCompany, logo, createdAt, updatedAt
export const companyCreateSchema = z.object({
    nameCompany: z
        .string()
        .min( 1, { message: 'El nombre de la compañia debe tener al menos 1 caracter' })
        .max( 200, { message: 'El nombre de la compañia no puede tener más de 200 caracteres'})
        .trim()
        .toLowerCase()
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9\s.,'()-]+(?:[ &]+[a-zA-Z0-9\s.,'()-]+)*$/, { message: 'El nombre de la compañia contiene caracteres no permitidos.'}),
    logo: z
        .string()
        .nonempty()
        .url( { message: 'Debe ser una URL válida' } )
        .regex(/^.*\.(jpg|jpeg|png|gif|svg)$/i, { message: 'Debe ser una URL de imagen (jpeg, jpg, png o svg)' }),
});

export type TCompanyFromSchema = z.infer< typeof companyCreateSchema >;