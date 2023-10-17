import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client"
import retrieveProgress from "./retrieve-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null
}

type DashboardCourses = {
    completedCourses: any[]
    coursesInProgress: any[]
}

export const retrieveDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchaseCourses = await db.purchase.findMany({
            where:{
                userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        const courses = purchaseCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[]

        for(let course of courses){
            const progress = await retrieveProgress(userId, course.id)
            course["progress"] = progress
        }

        const completedCourses = courses.filter((course) => course.progress === 100)
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

        return {
            completedCourses,
            coursesInProgress
        }

    } catch (error) {
        console.log("RETRIEVE_DASHBOARD_COURSES", error)
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }
}