import { Category, Course } from "@prisma/client";

import retrieveProgress from '@/actions/retrieve-progress'
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null
}

type RetrieveCourses = {
    userId: string;
    title: string
    categoryId?: string
}

export const retrieveCourses = async ({ userId, title, categoryId}: RetrieveCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                // no purchase any courses yet, list all the courses without progress
                if(course.purchases.length === 0){
                    return {
                        ...course,
                        progress: null
                    }
                }

                // if purchase any courses, will shows the course's progress
                const progressPercentage = await retrieveProgress(userId, course.id)

                return {
                    ...course,
                    progress: progressPercentage
                }
            })
        )

        return coursesWithProgress;

    } catch (error) {
        console.log("RETRIEVE_COURSES", error)
        return [];   
    }
}

