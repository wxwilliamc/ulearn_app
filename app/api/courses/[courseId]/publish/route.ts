import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import next from "next";
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params }: { params: { courseId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { courseId } = params

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if(!course) return new NextResponse("Not Found", { status: 404 })

        const anyCoursePublished = course.chapters.some((chapter) => chapter.isPublished)

        if(!course || !course.title || !course.description || !course.price || !course.imageUrl || !course.categoryId || !anyCoursePublished){
            return new NextResponse("Missing Required Fields", { status: 404 })
        }

        await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })

        return new NextResponse("Course Published", { status: 200 })

    } catch (error) {
        console.log("COURSE_PUBLISH", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}