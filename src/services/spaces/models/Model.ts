import { z } from 'zod'
import { PostSchema } from '../shared/Validators'

export type SpaceEntry = z.infer<typeof PostSchema>