import {z} from 'zod';
export const signupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8,'password must be atleast 8 characters')
})