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

export const editCoursePriceSchema = z.object({
    price: z.coerce.number(),
})

export type editCoursePriceSchemaType = z.infer<typeof editCoursePriceSchema>

export const editAttachmentsSchema = z.object({
    url: z.string().min(1, {
        message: "attachment(s) is required."
    }),
})

export type editAttachmentsSchemaType = z.infer<typeof editAttachmentsSchema>

export const editChaptersSchema = z.object({
    title: z.string().min(1, {
        message: "attachment(s) is required."
    }),
})

export type editChaptersSchemaType = z.infer<typeof editChaptersSchema>

export const editChaptersAccessSchema = z.object({
    isFree: z.boolean().default(false),
})

export type editChaptersAccessSchemaType = z.infer<typeof editChaptersAccessSchema>

export const editChaptersVideoUrlSchema = z.object({
    videoUrl: z.string().min(1),
})

export type editChaptersVideoUrlSchemaType = z.infer<typeof editChaptersVideoUrlSchema>