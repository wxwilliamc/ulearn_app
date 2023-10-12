"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editCategorySchemaType, editCategorySchema } from '@/schema/form'
import { HandIcon, PencilIcon, PointerIcon } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import { Combobox } from '@/components/ui/combobox'

interface CategoryFormProps {
    initialData: Course
    courseId: string
    options: {
        label: string, value: string
    }[]
}

const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editCategorySchemaType>({
        resolver: zodResolver(editCategorySchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ''
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editCategorySchemaType) => {
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
  
    // check if the categoryid value match the option value, then show that label
    const selectedOption = options.find((option) => option.value === initialData.categoryId)

    return (
    <div className='mt-5 border bg-green-50 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course Category
            <Button onClick={toggleEdit} variant='ghost'>
                {isEditing ? (
                    <>
                        Cancel
                    </>
                ) : (
                    <>
                        <PointerIcon className='w-4 h-4 mr-2'/>
                        Edit
                    </>
                )}
            </Button>
        </div>

        {!isEditing && (
            <p className='text-sm mt-2'>
                {selectedOption?.label || 'No Category'}
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                    <FormField 
                        control={form.control}
                        name='categoryId'
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox 
                                        options={...options}
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

export default CategoryForm