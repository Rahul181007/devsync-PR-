import {z} from 'zod';
import { signupSchema } from '../../validators/auth/signup.validator';

export type SignupDTO=z.infer<typeof signupSchema>