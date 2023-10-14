import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
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
            }
        })

        if(!course) return new NextResponse("Not Found", { status: 404 })

        await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })

        return new NextResponse("Course Unpublished", { status: 200 })

    } catch (error) {
        console.log("COURSE_UNPUBLISH", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}