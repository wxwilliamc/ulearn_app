"use client"

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editCourseDescriptionSchema, editCourseDescriptionSchemaType, editCourseImageSchema, editCourseImageSchemaType, editCourseTitleSchema, editCourseTitleSchemaType } from '@/schema/form'
import { ImageIcon, PencilIcon, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'
import Image from 'next/image'
import FileUpload from '@/components/File-Uplaod'

interface ImageFormProps {
    initialData: Course
    courseId: string
}

const ImageForm = ({ initialData, courseId }: ImageFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    
    const form = useForm<editCourseImageSchemaType>({
        resolver: zodResolver(editCourseImageSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || "",
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: editCourseImageSchemaType) => {
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
            Course Image
            <Button onClick={toggleEdit} variant='ghost'>
                
                {isEditing && (
                    <>
                        Cancel
                    </>
                )}

                {!isEditing && initialData.imageUrl && (
                    <>
                        <PencilIcon className='w-4 h-4 mr-2'/>
                        Edit
                    </>
                )}

                {!isEditing && !initialData.imageUrl && (
                    <>
                        <PlusCircle className='w-4 h-4 mr-2'/>
                        Add an Image
                    </>
                )}
                    
            </Button>
        </div>

        {/* first time upload, default image */}
        {!isEditing && (!initialData.imageUrl ? (
            <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4'>
                <ImageIcon className='h-10 w-10 text-slate-600'/>
            </div>
        ): (
            // course's image
            <div className='relative aspect-video mt-2'>
                <Image 
                    alt="upload"
                    fill
                    className='object-cover rounded-md'
                    src={initialData.imageUrl}
                />
            </div>
        ))}

        {isEditing && (
            <div>
                <FileUpload 
                    endpoint='courseImage'
                    onChange={(url) => {
                        if(url){
                            onSubmit({ imageUrl: url})
                        }
                    }}
                />

                <div className='text-xs text-muted-foreground mt-4'>
                    16:9 aspect ratio recommended
                </div>
            </div>
        )}
    </div>
  )
}

export default ImageForm