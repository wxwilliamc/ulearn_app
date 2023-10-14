"use client"

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { editChaptersVideoUrlSchemaType, editCourseImageSchemaType } from '@/schema/form'
import { ImageIcon, ImagePlusIcon, PencilIcon, PlusCircle, VideoIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course, MuxData } from '@prisma/client'
import Image from 'next/image'
import FileUpload from '@/components/File-Uplaod'
import MuxPlayer from '@mux/mux-player-react'

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string
    chapterId: string
}

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps ) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const onSubmit = async (values: editChaptersVideoUrlSchemaType) => {
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
            Chapter Video
            <Button onClick={toggleEdit} variant='ghost'>
                
                {isEditing && (
                    <>
                        Cancel
                    </>
                )}

                {!isEditing && initialData.videoUrl && (
                    <>
                        <VideoIcon className='w-4 h-4 mr-2'/>
                        Edit Video
                    </>
                )}

                {!isEditing && !initialData.videoUrl && (
                    <>
                        <PlusCircle className='w-4 h-4 mr-2'/>
                        Add a Video
                    </>
                )}
                    
            </Button>
        </div>

        {!isEditing && (!initialData.videoUrl ? (
            <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4'>
                <VideoIcon className='h-10 w-10 text-slate-600'/>
            </div>
        ): (
            <div className='relative aspect-video mt-2'>
                <MuxPlayer 
                    playbackId={initialData?.muxData?.playbackId || ''}
                />
            </div>
        ))}

        {isEditing && (
            <div>
                <FileUpload 
                    endpoint='chapterVideo'
                    onChange={(url) => {
                        if(url){
                            onSubmit({ videoUrl: url})
                        }
                    }}
                />

                <div className='text-xs text-muted-foreground mt-4'>
                    Upload the chapter&apos;s video
                </div>
            </div>
        )}

        {initialData.videoUrl && !isEditing && (
            <div className='text-xs text-muted-foreground mt-2'>
                Videos can take few minutes to process. Refresh the page if videos does not appear.
            </div>
        )}
    </div>
  )
}

export default ChapterVideoForm