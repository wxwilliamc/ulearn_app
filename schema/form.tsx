// validations

import * as z from 'zod'

export const newCourseTitleSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required."
    })
})

export type newCourseTitleSchemaType = z.infer<typeof newCourseTitleSchema>

export const editCourseTitleSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required."
    })
})

export type editCourseTitleSchemaType = z.infer<typeof editCourseTitleSchema>

export const editCourseDescriptionSchema = z.object({
    description: z.string().min(5, {
        message: "Description is required."
    })
})

export type editCourseDescriptionSchemaType = z.infer<typeof editCourseDescriptionSchema>

export const editCourseImageSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required."
    })
})

export type editCourseImageSchemaType = z.infer<typeof editCourseImageSchema>

export const editCategorySchema = z.object({
    categoryId: z.string().min(1),
})

export type editCategorySchemaType = z.infer<typeof editCategorySchema>