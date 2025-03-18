"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyCreateSchema = void 0;
const zod_1 = require("zod");
// id, nameCompany, logo, createdAt, updatedAt
exports.companyCreateSchema = zod_1.z.object({
    nameCompany: zod_1.z
        .string({ invalid_type_error: 'El nombre de la compañia debe ser un texto, no otro tipo de dato.' })
        .min(1, { message: 'El nombre de la compañia debe tener al menos 1 caracter' })
        .max(200, { message: 'El nombre de la compañia no puede tener más de 200 caracteres' })
        .regex(/^[a-zA-Z0-9Ññ]([a-zA-Z0-9Ññ\s.,'()-]*(?:[ &]+[a-zA-Z0-9Ññ\s.,'()-]+)*)?$/, { message: 'El nombre de la compañia contiene caracteres no permitidos.' })
        .trim()
        .toLowerCase(),
    //.regex(/^[a-zA-Z0-9][a-zA-Z0-9\s.,'()-]+(?:[ &]+[a-zA-Z0-9\s.,'()-]+)*$/, { message: 'El nombre de la compañia contiene caracteres no permitidos.'}),
    logo: zod_1.z
        .string()
        .regex(/^(\/uploads\/logos\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png))$/i, { message: 'El logo debe ser una ruta válida en formato (jpeg, jpg, png o svg)' })
        .max(255, { message: 'La ruta del logo no puede superar los 255 caracteres.' })
        .optional(),
});
