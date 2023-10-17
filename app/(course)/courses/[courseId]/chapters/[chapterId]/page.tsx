
import RetrieveChapters from '@/actions/retrieve-chapters';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from './_components/VideoPlayer';
import CourseEnrollButton from './_components/CourseEnrollButton';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/Preview';
import { File } from 'lucide-react';
import CourseProgressBtn from './_components/CourseProgressBtn';

const ChapterPage = async ({ params }: { params: { courseId: string, chapterId: string }}) => {

    const { chapterId, courseId } = params
    const { userId } = auth();

    if(!userId) return redirect('/')

    const {
        attachments,
        chapter,
        course,
        muxData,
        nextChapterId,
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
                        nextChapterId={nextChapterId?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>

                <div>
                    <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                        <h2 className='text-2xl font-semibold'>
                            Introduction
                        </h2>

                        {purchase ? (
                            <>
                                <CourseProgressBtn 
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    nextChapterId={nextChapterId?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            </>
                        ): (
                            <>
                                <CourseEnrollButton 
                                    courseId={courseId}
                                    price={course?.price!}
                                />
                            </>
                        )}
                    </div>

                    <Separator />

                    <div>
                        <Preview value={chapter.description!}/>
                    </div>
                    
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className='p-4'>
                                {attachments.map((attachment) => (
                                    <a href={attachment.url} key={attachment.id} target='_blank' className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'>
                                        <File />
                                        <p className='line-clamp-1'>
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChapterPage