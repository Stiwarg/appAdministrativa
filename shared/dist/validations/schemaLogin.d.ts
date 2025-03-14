import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    nit: z.ZodNumber;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nit: number;
    password: string;
}, {
    nit: number;
    password: string;
}>;
export type TLoginSchema = z.infer<typeof loginSchema>;
//# sourceMappingURL=schemaLogin.d.ts.map