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

        const unpublishChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: false
            }
        })

        const chaptersUnpublish = await db.chapter.findMany({
            where: {
                id: chapterId,
                courseId,
                isPublished: true
            }
        })

        if(!chaptersUnpublish.length){
            const courseUnpublish = await db.course.update({
                where:{
                    userId,
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishChapter);

    } catch (error) {
        console.log("CHAPTER_ID_UNPUBLISH", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}