import {z} from 'zod';

export const companySchema=z.object({
    name:z.string().trim().min(2),
    domain:z.string().trim().min(3).optional(),
    adminEmail: z.string().email().optional()

})