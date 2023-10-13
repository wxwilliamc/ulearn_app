import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { courseId: string }}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { courseId } = params;
        const { title } = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId,
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data:{
                title,
                courseId,
                position: newPosition
            }
        })

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("CHAPTERS_ID", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}