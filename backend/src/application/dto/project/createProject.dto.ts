import {z} from 'zod';
import { createProjectSchema } from '../../validators/project/createProject.validator';

export type CreateProjectDTO=z.infer<typeof createProjectSchema>