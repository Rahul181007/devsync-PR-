 import {z} from 'zod'

 export const verifyInviteQuerySchema=z.object({
    token:z.string().trim().min(1,'Invite token is required')
 }).strict();