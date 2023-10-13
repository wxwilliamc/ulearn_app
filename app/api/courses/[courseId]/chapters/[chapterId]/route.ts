import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params }: { params: { courseId: string, chapterId: string }}) => {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { chapterId, courseId } = params
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const {isPublished, ...values } = await req.json();

        const chapter = await db.chapter.update({
            where:{
                id: chapterId,
                courseId
            },
            data: {
                ...values
            }
        })

        // TODO: Handle video upload

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("CHAPTER_ID_UPDATE", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}