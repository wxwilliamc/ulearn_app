"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'
import { editCoursePriceSchema, editCoursePriceSchemaType } from '@/schema/form'
import { formatPrice } from '@/lib/format'

interface PriceFormProps {
    initialData: Course
    courseId: string
}

const PriceForm = ({ initialData, courseId }: PriceFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editCoursePriceSchemaType>({
        resolver: zodResolver(editCoursePriceSchema),
        defaultValues: {
            price: initialData.price || undefined
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editCoursePriceSchemaType) => {
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
            Course Price
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
                {initialData.price ? formatPrice(initialData.price) : "No Price"}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='price'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder='Set a price for your course'
                                        type='number'
                                        disabled={isSubmitting}
                                        step='0.01'
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

export default PriceForm