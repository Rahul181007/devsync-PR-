import {z} from 'zod'
import { updateProjectSchema } from '../../validators/project/updateProject.validator'

export type UpdateProjectDTO=z.infer<typeof updateProjectSchema>