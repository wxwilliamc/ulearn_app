import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PUT = async (req: Request, { params }: { params: { courseId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { courseId } = params

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        })

        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 })
        
        const { chapterList } = await req.json();

        for (let item of chapterList){
            await db.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position
                }
            })
        }

        return new NextResponse("Success", {status: 200})

    } catch (error) {
        console.log("CHAPTERS_ID", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}