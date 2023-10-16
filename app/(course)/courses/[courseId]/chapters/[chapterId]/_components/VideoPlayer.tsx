"use client"

import React, { useState } from 'react'
import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import { Chapter } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Loader2, Lock } from 'lucide-react'

interface VideoPlayerProps {
    chapterId: string
    title: string
    courseId: string
    nextChapter?: string
    playbackId: string
    isLocked: boolean
    completeOnEnd: boolean
}

const VideoPlayer = ({ chapterId, title, courseId, nextChapter, playbackId, isLocked, completeOnEnd }: VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(false)
  return (
    <div className='relative aspect-video'>
        {/* Free access, and if video is not ready yet */}
        {!isLocked && !isReady && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
                <Loader2 className='h-8 w-8 animate-spin text-secondary'/>
            </div>
        )}
        {/* Purchase Required */}
        {isLocked && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
                <Lock className='w-8 h-8'/>
                <p className='text-sm'>
                    This chapter is locked.
                </p>
            </div>
        )}
        {/* Free access, Play Video */}
        {!isLocked && (
            <MuxPlayer 
                title={title}
                className={cn(!isReady && "hidden")}
                onCanPlay={() => setIsReady(true)}
                onEnded={() => {}}
                autoPlay
                playbackId={playbackId}
            />
        )}
    </div>
  )
}

export default VideoPlayer