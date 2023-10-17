"use client"

import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface CourseProgressBtnProps {
    chapterId: string
    courseId: string
    nextChapterId?: string
    isCompleted?: boolean
}

const CourseProgressBtn = ({ chapterId, courseId, nextChapterId, isCompleted }: CourseProgressBtnProps) => {

    const Icon = isCompleted ? XCircle : CheckCircle

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const markComplete = async () => {
        try {
            setIsLoading(true)

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if(isCompleted && !nextChapterId){
                confetti.onOpen();
            }

            if(!isCompleted && nextChapterId){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
            
            router.refresh();
            toast.success("Progress Updated.")
        } catch (error) {
            toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <Button type='button' variant={isCompleted ? "outline" : "success"} className='w-full md:w-auto' disabled={isLoading} onClick={markComplete}>
            {isCompleted ? "Not completed" : "Mark as Complete"}
            <Icon className='h-4 w-4 ml-2'/>
        </Button>
    )
}

export default CourseProgressBtn