import {z} from 'zod';
import { createWorkspaceSchema } from '../../validators/company/createWorkspace.validator';

export type CreateWorkspaceDTO=z.infer<typeof createWorkspaceSchema>