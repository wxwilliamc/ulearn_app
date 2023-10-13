"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editChaptersSchema, editChaptersSchemaType, editCourseDescriptionSchema, editCourseDescriptionSchemaType, editCourseTitleSchema, editCourseTitleSchemaType } from '@/schema/form'
import { Loader2, PencilIcon, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'
import { cn } from '@/lib/utils'
import ChapterList from '../ChapterList'

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] }
    courseId: string
}

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps ) => {

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    
    const form = useForm<editChaptersSchemaType>({
        resolver: zodResolver(editChaptersSchema),
        defaultValues: {
            title: initialData.title || ''
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editChaptersSchemaType) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Chapter(s) Updated.")
            toggleCreate();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.")
        }
    }

    const toggleCreate = () => setIsCreating((create) => !create)

    const onEdit = (id: string) => {
        router.push(`/mentor/courses/${courseId}/chapters/${id}`)
    }

    const onReorder = async (updateData: {id: string, position: number}[]) => {
        try {
            setIsUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                chapterList: updateData
            })

            toast.success("Course Chapter(s) Updated.")
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsUpdating(false)
        }
    }
  
    return (
    <div className='relative mt-5 border bg-green-50 rounded-md p-4'>
        {isUpdating && (
            <div className='absolute h-full w-full bg-slate-600/20 top-0 right-0 rounded-md flex items-center justify-center'>
                <Loader2 className='animate-spin h-6 w-6 text-green-700'/>
            </div>
        )}
        <div className='font-medium flex items-center justify-between'>
            Course Chapters
            <Button onClick={toggleCreate} variant='ghost'>
                {isCreating ? (
                    <>
                        Cancel
                    </>
                ) : (
                    <>
                        <PlusCircle className='w-4 h-4 mr-2'/>
                        Add a chapter
                    </>
                )}
            </Button>
        </div>

        {isCreating && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        disabled={isSubmitting}
                                        placeholder='Introduction to Chapter'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isSubmitting || !isValid} type='submit'>
                        Create
                    </Button>
                </form>
            </Form>
        )}

        {!isCreating && (
            <div className={cn(`text-sm mt-2`, !initialData.chapters.length && "text-slate-500 italic")}>
                {!initialData.chapters.length && "No chapters"}
                <ChapterList 
                    onEdit={onEdit}
                    onReorder={onReorder}
                    items={initialData.chapters || []}
                />
            </div>
        )}

        {!isCreating && (
            <p className='text-xs text-muted-foreground mt-4'>
                Drag and drop to reorder the chapters
            </p>
        )}
    </div>
  )
}

export default ChaptersForm