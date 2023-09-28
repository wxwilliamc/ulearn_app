import * as z from 'zod'

export const newCourseTitleSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required."
    })
})

export type newCourseTitleSchemaType = z.infer<typeof newCourseTitleSchema>