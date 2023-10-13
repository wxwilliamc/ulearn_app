import { IconBadge } from '@/components/Icon-Badge';
import { db } from '@/lib/db';
import { auth, useAuth } from '@clerk/nextjs'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import ChapterTitleForm from './_components/ChapterTitleForm';
import ChapterDescriptionForm from './_components/ChapterDescriptionForm';
import ChapterAccessForm from './_components/ChapterAccessForm';

const ChapterDetailPage = async ({ params } : {params: { courseId: string, chapterId: string }}) => {
    
    const { userId } = auth();
    if(!userId) redirect('/');

    const {chapterId, courseId} = params

    const chapter = await db.chapter.findUnique({
        where:{
            id: chapterId,
            courseId: courseId
        },
        include: {
            muxData: true
        }
    })

    if(!chapter){
        toast.error("Chapter not found.")
        return redirect(`/mentor/courses/${courseId}`)
    }

    const requiredField = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]

    const totalRequiredField = requiredField.length;
    const comepletedField = requiredField.filter(Boolean).length;
    const fieldStatus = `(${comepletedField}/${totalRequiredField})`

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='w-full'>
                    <Link
                        href={`/mentor/courses/${courseId}`}
                        className='flex items-center text-sm hover:opacity-75 transition mb-6'
                    >   
                        <ArrowLeft className='h-4 w-4 mr-2'/>
                        Course Setup
                    </Link>

                    <div className='flex items-center justify-between w-full'>
                        <div className='flex flex-col gap-y-2'>
                            <h1 className='text-2xl font-medium'>
                                Chapter Creation
                            </h1>
                            <span className='text-sm text-green-300'>
                                Complete all fields {fieldStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div className='space-y-4'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard}/>
                            <h2 className='text-xl'>
                                Customize your chapter
                            </h2>
                        </div>

                        <ChapterTitleForm 
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />

                        <ChapterDescriptionForm 
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>

                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={Eye}/>
                            <h2 className='text-xl'>Settings</h2>
                        </div>

                        <ChapterAccessForm 
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>

                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={Video}/>
                        <h2 className='text-xl'>Add a video</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChapterDetailPage