"use client"

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ActionsProps {
    disabled: boolean
    courseId: string
    isPublished: boolean
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState<boolean>();
    const router = useRouter();
    const confetti = useConfettiStore();

    const deleteChapter = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Course Deleted.")
            router.refresh();
            router.push('/mentor/courses')
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
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Unpublished Successful.")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Published Successful.")
                confetti.onOpen();
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

export default Actions