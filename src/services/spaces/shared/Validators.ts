import { v4 } from 'uuid'
import { z } from 'zod'

export const PostSchema = z.object({
  name: z.string(),
  location: z.string(),
  photoUrl: z.string().optional(),
}).transform((data) => ({
  ...data,
  id: v4(),
}))