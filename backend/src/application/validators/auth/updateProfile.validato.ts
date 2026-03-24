import { z} from 'zod'


export const updateProfileSchema=z.object({
    name:z.string().trim().min(4,'Name must be at least 2 characters').optional(),
    avatarUrl:z.string().optional()
})