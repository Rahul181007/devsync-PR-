import {z} from 'zod';

export const acceptInviteQuerySchema=z.object({
    token:z.string().min(1),
    password:z.string().min(6),
    name:z.string().min(4)
})