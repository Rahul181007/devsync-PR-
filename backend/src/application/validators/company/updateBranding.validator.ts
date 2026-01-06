import {z} from 'zod';
export const updateCompanyBrandingSchema=z.object({
    themeColor:z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color").optional()
})