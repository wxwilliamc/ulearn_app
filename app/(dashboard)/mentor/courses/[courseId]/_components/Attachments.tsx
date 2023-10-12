"use client"

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { editAttachmentsSchemaType } from '@/schema/form'
import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import FileUpload from '@/components/File-Uplaod'

interface AttachmentsProps {
    initialData: Course & { attachments: Attachment[] }
    courseId: string
}

const Attachments = ({ initialData, courseId }: AttachmentsProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const onSubmit = async (values: editAttachmentsSchemaType) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course Updated.")
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.")
        }
    }

    const toggleEdit = () => setIsEditing((edit) => !edit)

    const toggleDelete = async (attachmentId: string) => {
        try {
            setDeleteId(attachmentId)

            await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`)
            router.refresh();
            toast.success("Attachment Deleted.")
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setDeleteId(null)
        }
    }
  
    return (
    <div className='mt-5 border bg-green-50 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course Attachments
            <Button onClick={toggleEdit} variant='ghost'>
                
                {isEditing && (
                    <>
                        Cancel
                    </>
                )}

                {!isEditing &&  (
                    <>
                        <PlusCircle className='w-4 h-4 mr-2'/>
                        Add a file
                    </>
                )}
                    
            </Button>
        </div>

        {/* first time upload, default image */}
        {!isEditing && (
            <>
                {initialData.attachments.length === 0 && (
                    <p className='text-sm mt-2 text-slate-500 italic'>
                        No attachments yet
                    </p>
                )}

                {initialData.attachments.length > 0 && (
                    <div className='space-y-2'>
                        {initialData.attachments.map((attachment) => (
                            <div key={attachment.id} className='flex items-center p-3 w-full bg-white border-sky-200 border text-sky-700 rounded-md'>
                                <File className='w-4 h-5 mr-2 flex-shrink-0'/>
                                <p className='text-xs line-clamp-1 truncate'>
                                    {attachment.name}
                                </p>

                                {deleteId != attachment.id && (
                                    <button
                                        onClick={() => toggleDelete(attachment.id)}
                                        className='ml-auto hover-opacity-75'
                                    >
                                        <X className="w-4 h-4"/>
                                    </button>
                                )}

                                {deleteId === attachment.id && (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin ml-auto"/>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
        
        {isEditing && (
            <div>
                <FileUpload 
                    endpoint='courseAttachment'
                    onChange={(url) => {
                        if(url){
                            onSubmit({ url: url})
                        }
                    }}
                />

                <div className='text-xs text-muted-foreground mt-4'>
                    Add anything your learner might need to learn and complete with this course.
                </div>
            </div>
        )}
    </div>
  )
}

export default Attachments