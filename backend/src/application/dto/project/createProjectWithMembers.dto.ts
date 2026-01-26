import {z} from 'zod';
import { createProjectWithMembersSchema } from '../../validators/project/createProject.validator';

export type createProjectWithMemberDTO=z.infer<typeof createProjectWithMembersSchema>