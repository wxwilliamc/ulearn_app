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
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'

interface DescriptionFormProps {
    initialData: Course
    courseId: string
}

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps ) => {

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
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Updated.")
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
            Course Description
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
                {initialData.description}
            </p>
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
                                    <Textarea
                                        rows={3} 
                                        className='bg-white'
                                        disabled={isSubmitting}
                                        placeholder='e.g Tailwind Css course details...'
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

export default DescriptionForm