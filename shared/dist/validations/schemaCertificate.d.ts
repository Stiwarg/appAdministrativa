import { z } from 'zod';
import { Certificate } from './utils/enums.js';
export declare const certificateSchema: z.ZodEffects<z.ZodObject<{
    nit: z.ZodNumber;
    year: z.ZodNumber;
    typeFile: z.ZodNativeEnum<typeof Certificate>;
    period: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nit: number;
    period: string;
    typeFile: Certificate;
    year: number;
}, {
    nit: number;
    period: string;
    typeFile: Certificate;
    year: number;
}>, {
    nit: number;
    period: string;
    typeFile: Certificate;
    year: number;
}, {
    nit: number;
    period: string;
    typeFile: Certificate;
    year: number;
}>;
export type certificateRequest = z.infer<typeof certificateSchema>;
//# sourceMappingURL=schemaCertificate.d.ts.map