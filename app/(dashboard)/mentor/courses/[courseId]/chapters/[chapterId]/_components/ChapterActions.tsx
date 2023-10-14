"use client"

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ActionsProps {
    disabled: boolean
    courseId: string
    chapterId: string
    isPublished: boolean
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState<boolean>();
    const router = useRouter();

    const deleteChapter = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter Deleted.")
            router.refresh();
            router.push(`/mentor/courses/${courseId}`)
        } catch (error) {
            toast.error("something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    const publishChapter = async () => {
        try {
            setIsLoading(true)

            if (isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Unpublished Successful.")
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Published Successful.")
            }

            router.refresh();

        } catch (error) {
            toast.error("something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }
  
    return (
    <div className='flex items-center gap-x-2'>
        <Button
            disabled={disabled || isLoading}
            onClick={publishChapter}
            variant='outline'
            size='sm'
        >
            {isPublished ? "Unpublish" : "Publish"}
        </Button>

        <ConfirmModal onConfirm={deleteChapter}>
            <Button size='sm' disabled={isLoading}>
                <Trash className='h-4 w-4'/>
            </Button>
        </ConfirmModal>
    </div>
  )
}

export default ChapterActions