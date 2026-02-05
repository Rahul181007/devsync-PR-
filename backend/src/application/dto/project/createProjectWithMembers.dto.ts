import {z} from 'zod';
import { createProjectWithMembersSchema } from '../../validators/project/createProject.validator';

export type CreateProjectWithMembersDTO=z.infer<typeof createProjectWithMembersSchema>