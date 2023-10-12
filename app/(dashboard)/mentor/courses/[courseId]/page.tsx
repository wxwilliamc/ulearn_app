import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/Icon-Badge';
import { CircleDollarSign, File, LayoutDashboardIcon, ListChecks } from 'lucide-react';
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import ImageForm from './_components/ImageForm';
import CategoryForm from './_components/CategoryForm';
import PriceForm from './_components/PriceForm';
import Attachments from './_components/Attachments';

const CourseDetails = async ({ params} : {params: { courseId: string}}) => {
    
    const { userId } = auth();
    if(!userId) return redirect("/");

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    if(!course){
        return redirect('/');
    }

    const fieldsRequired = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ]

    const totalFields = fieldsRequired.length;
    const completedFields = fieldsRequired.filter(Boolean).length;
    const fieldsProgress = `(${completedFields}/${totalFields})`;


    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>Course Setup</h1>
                    <span className='text-green-400 text-sm'>Complete all fields {fieldsProgress}</span>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                {/* Left Section */}
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboardIcon}/>
                        <h2 className='text-xl'>Customize Your Course</h2>
                    </div>
                    <TitleForm 
                        initialData={course}
                        courseId={course.id}
                    />

                    <DescriptionForm 
                        initialData={course}
                        courseId={course.id}
                    />

                    <ImageForm 
                        initialData={course}
                        courseId={course.id}
                    />

                    <CategoryForm 
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>

                {/* Right Section */}
                <div className='space-y-6'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={ListChecks}/>
                            <h2 className='text-xl'>Course Chapters</h2>
                        </div>

                        <div>
                            TODO: Chapters
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className='text-xl'>Sell your course</h2>
                        </div>
                    </div>

                    <PriceForm 
                        initialData={course}
                        courseId={course.id}
                    />

                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={File}/>
                            <h2 className='text-xl'>Resources & Attachments</h2>
                        </div>
                    </div>

                    <Attachments 
                        initialData={course}
                        courseId={course.id}
                    />

                </div>
            </div>
        </div>
    )
}

export default CourseDetails