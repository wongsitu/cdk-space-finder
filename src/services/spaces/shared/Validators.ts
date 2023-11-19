import { v4 } from 'uuid'
import { z } from 'zod'

export const PostSchema = z.object({
  name: z.string(),
  location: z.string(),
  photoUrl: z.string().optional(),
})

export const CreatePostSchema = PostSchema.transform((data) => ({
  ...data,
  id: v4(),
}))

export const UpdatePostSchema = PostSchema.partial()
