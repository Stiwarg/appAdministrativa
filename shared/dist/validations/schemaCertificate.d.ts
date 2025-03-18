import { z } from 'zod';
import { Certificate } from './utils/enums.js';
export declare const certificateSchema: z.ZodEffects<z.ZodObject<{
    nit: z.ZodOptional<z.ZodNumber>;
    year: z.ZodNumber;
    typeFile: z.ZodNativeEnum<typeof Certificate>;
    period: z.ZodString;
}, "strip", z.ZodTypeAny, {
    period: string;
    typeFile: Certificate;
    year: number;
    nit?: number | undefined;
}, {
    period: string;
    typeFile: Certificate;
    year: number;
    nit?: number | undefined;
}>, {
    period: string;
    typeFile: Certificate;
    year: number;
    nit?: number | undefined;
}, {
    period: string;
    typeFile: Certificate;
    year: number;
    nit?: number | undefined;
}>;
export type certificateRequest = z.infer<typeof certificateSchema>;
//# sourceMappingURL=schemaCertificate.d.ts.map