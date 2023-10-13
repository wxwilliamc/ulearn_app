"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editChaptersAccessSchema, editChaptersAccessSchemaType, editChaptersSchemaType, editCourseDescriptionSchema, editCourseDescriptionSchemaType, editCourseTitleSchema, editCourseTitleSchemaType } from '@/schema/form'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'
import { Editor } from '@/components/Editor'
import { Preview } from '@/components/Preview'
import { Checkbox } from '@/components/ui/checkbox'

interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string
    chapterId: string
}

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editChaptersAccessSchemaType>({
        resolver: zodResolver(editChaptersAccessSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editChaptersAccessSchemaType) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Updated.")
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.")
        }
    }

    const toggleEdit = () => setIsEditing((edit) => !edit)
  
    return (
    <div className='mt-5 border bg-green-50 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Chapter Permission
            <Button onClick={toggleEdit} variant='ghost'>
                {isEditing ? (
                    <>
                        Cancel
                    </>
                ) : (
                    <>
                        <PencilIcon className='w-4 h-4 mr-2'/>
                        Edit
                    </>
                )}
            </Button>
        </div>

        {!isEditing && (
            <div className='text-sm mt-2'>
                {initialData.isFree ? (
                    <>
                        <p>This chapter is free for preview.</p>
                    </>
                ): (
                    <>
                        <p>Please upgrade in order to preview this chapters.</p>
                    </>
                )}
            </div>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='isFree'
                        render={({field}) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>

                                <div className='space-y-1 leading-none'>
                                    <FormDescription>
                                        Check this box if you want to make this chapter free for preview.
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isSubmitting || !isValid} type='submit'>
                        Save
                    </Button>
                </form>
            </Form>
        )}
    </div>
  )
}

export default ChapterAccessForm