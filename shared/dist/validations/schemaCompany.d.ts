import { z } from 'zod';
export declare const companyCreateSchema: z.ZodObject<{
    nameCompany: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    nameCompany: string;
    logo?: string | undefined;
}, {
    nameCompany: string;
    logo?: string | undefined;
}>;
export type TCompanyFromSchema = z.infer<typeof companyCreateSchema>;
//# sourceMappingURL=schemaCompany.d.ts.map