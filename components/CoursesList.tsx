import { Category, Course } from '@prisma/client';
import React from 'react'
import CourseCard from './CourseCard';

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null
}

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
        <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
            {items.map((item) => (
                // why add !
                // inside prisma model, imageUrl, price, category are options to provide
                // the error shows as the typescript thought it will retrieve any null values
                // but these courses were published, and all the options value were all provided in this case, if we failed to provide those options value, courses will be fail to publish
                // so we're adding ! in the back, to ensure that we have provided the values for it
                <CourseCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    imageUrl={item.imageUrl!}
                    chaptersLength={item.chapters.length}
                    price={item.price!}
                    progress={item.progress}
                    category={item?.category?.name!}
                />
            ))}
        </div>

        {items.length === 0 && (
            <div className='text-center text-sm text-muted-foreground mt-10'>
                No courses found
            </div>
        )}
    </div>
  )
}

export default CoursesList