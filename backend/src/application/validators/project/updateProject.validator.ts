import {z} from 'zod';

export const updateProjectSchema=z.object({
    name:z.string().min(2).max(100).optional(),
    description:z.string().optional(),
    status:z.enum(['ACTIVE','COMPLETED','ARCHIVED']).optional(),
    startDate:z.coerce.date().optional(),
    endDate:z.coerce.date().optional(),
})