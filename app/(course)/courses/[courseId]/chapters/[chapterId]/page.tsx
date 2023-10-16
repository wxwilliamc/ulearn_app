
import RetrieveChapters from '@/actions/retrieve-chapters';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from './_components/VideoPlayer';

const ChapterPage = async ({ params }: { params: { courseId: string, chapterId: string }}) => {

    const { chapterId, courseId } = params
    const { userId } = auth();

    if(!userId) return redirect('/')

    const {
        attachments,
        chapter,
        course,
        muxData,
        nextChapter,
        purchase,
        userProgress,
    } = await RetrieveChapters({userId, courseId, chapterId})

    if(!chapter || !course) redirect ('/')

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner 
                    label='Course Completed. Congratulations.'
                    variant='success'
                />
            )}

            {isLocked && (
                <Banner 
                label='Please purchase this course in order to access this chapter.'
                variant='warning'
            />
            )}

            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    <VideoPlayer 
                        chapterId={chapterId}
                        title={chapter.title}
                        courseId={courseId}
                        nextChapter={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChapterPage