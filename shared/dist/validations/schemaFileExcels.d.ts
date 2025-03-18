import { z } from 'zod';
import { TypeFile, TypePeriod } from './utils/enums.js';
export declare const filesExcelsSchema: z.ZodEffects<z.ZodObject<{
    nameFile: z.ZodString;
    empresaId: z.ZodNumber;
    period: z.ZodNativeEnum<typeof TypePeriod>;
    typeFile: z.ZodNativeEnum<typeof TypeFile>;
    year: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    nameFile: string;
    empresaId: number;
    period: TypePeriod;
    typeFile: TypeFile;
    year: number;
}, {
    nameFile: string;
    empresaId: number;
    period: TypePeriod;
    typeFile: TypeFile;
    year: number;
}>, {
    nameFile: string;
    empresaId: number;
    period: TypePeriod;
    typeFile: TypeFile;
    year: number;
}, {
    nameFile: string;
    empresaId: number;
    period: TypePeriod;
    typeFile: TypeFile;
    year: number;
}>;
export type TFilesExcelsSchema = z.infer<typeof filesExcelsSchema>;
//# sourceMappingURL=schemaFileExcels.d.ts.map