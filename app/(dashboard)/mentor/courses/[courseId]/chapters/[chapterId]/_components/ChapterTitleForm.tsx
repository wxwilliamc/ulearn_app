"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editCourseTitleSchema, editCourseTitleSchemaType } from '@/schema/form'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ChapterTitleFormProps {
    initialData: {
        title: string
    }
    courseId: string
    chapterId: string
}

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editCourseTitleSchemaType>({
        resolver: zodResolver(editCourseTitleSchema),
        defaultValues: initialData,
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editCourseTitleSchemaType) => {
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
            Chapter Title
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
            <p className='text-sm mt-2'>
                {initialData.title}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        className='bg-white'
                                        disabled={isSubmitting}
                                        placeholder="Introduction to the course"
                                        {...field}
                                    />
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

export default ChapterTitleForm