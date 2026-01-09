import {z} from 'zod';
export const signupSchema=z.object({
    name:z.string().trim().min(4,'Name must be at least 2 characters'),
    email:z.string().email(),
    password:z.string().min(8,'password must be atleast 8 characters')
})