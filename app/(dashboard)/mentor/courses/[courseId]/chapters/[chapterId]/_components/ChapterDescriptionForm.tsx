"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editCourseDescriptionSchema, editCourseDescriptionSchemaType, editCourseTitleSchema, editCourseTitleSchemaType } from '@/schema/form'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'
import { Editor } from '@/components/Editor'
import { Preview } from '@/components/Preview'

interface ChapterDescriptionFormProps {
    initialData: Chapter
    courseId: string
    chapterId: string
}

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editCourseDescriptionSchemaType>({
        resolver: zodResolver(editCourseDescriptionSchema),
        defaultValues: {
            description: initialData.description || ''
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editCourseDescriptionSchemaType) => {
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
            Chapter Description
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
                {!initialData.description && "No description"}
                {initialData.description && (
                    <Preview 
                        value={initialData.description}
                    />
                )}
            </div>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Editor {...field}/>
                                </FormControl>
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

export default ChapterDescriptionForm