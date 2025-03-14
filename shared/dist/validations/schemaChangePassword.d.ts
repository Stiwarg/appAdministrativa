import { z } from 'zod';
export declare const baseSchemaPasswordUpdated: z.ZodObject<{
    nit: z.ZodNumber;
    newPassword: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nit: number;
    newPassword: string;
    password: string;
}, {
    nit: number;
    newPassword: string;
    password: string;
}>;
export declare const updatePasswordSchema: z.ZodEffects<z.ZodObject<{
    nit: z.ZodNumber;
    newPassword: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nit: number;
    newPassword: string;
    password: string;
}, {
    nit: number;
    newPassword: string;
    password: string;
}>, {
    nit: number;
    newPassword: string;
    password: string;
}, {
    nit: number;
    newPassword: string;
    password: string;
}>;
export declare const updatePasswordUpdateWithoutNit: z.ZodEffects<z.ZodObject<z.objectUtil.extendShape<{
    nit: z.ZodNumber;
    newPassword: z.ZodString;
    password: z.ZodString;
}, {
    nit: z.ZodOptional<z.ZodNumber>;
}>, "strip", z.ZodTypeAny, {
    newPassword: string;
    password: string;
    nit?: number | undefined;
}, {
    newPassword: string;
    password: string;
    nit?: number | undefined;
}>, {
    newPassword: string;
    password: string;
    nit?: number | undefined;
}, {
    newPassword: string;
    password: string;
    nit?: number | undefined;
}>;
//# sourceMappingURL=schemaChangePassword.d.ts.map