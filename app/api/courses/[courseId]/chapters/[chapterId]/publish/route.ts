import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params }: { params: { chapterId: string, courseId: string}}) => {
    try {
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { courseId, chapterId } = params

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId
            }
        })

        const muxData = await db.muxData.findUnique({
            where:{
                chapterId
            }
        })

        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) return new NextResponse("Missing required fields", { status: 404 })

        const publishChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishChapter);

    } catch (error) {
        console.log("CHAPTER_ID_PUBLISH", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}