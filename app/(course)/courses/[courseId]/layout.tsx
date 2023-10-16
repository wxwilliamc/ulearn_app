import retrieveProgress from '@/actions/retrieve-progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import CourseSidebar from './_components/CourseSidebar';
import CourseNavbar from './_components/CourseNavbar';

const CourseLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string}}) => {

    const { userId } = auth();
    if(!userId) redirect('/')

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include:{
                    userProgress: {
                        where:{
                            id: userId
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    })

    if(!course) return redirect('/')

    const progressCount = await retrieveProgress(userId, course.id)

    return (
        <div className='h-full'>
            <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
                <CourseNavbar 
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className='hidden md:flex h-full w-80 flex-col inset-y-0 fixed z-50'>
                <CourseSidebar 
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className='md:pl-80 md:pt-[80px] h-full'>
                {children}
            </main>
        </div>
    )
}

export default CourseLayout