import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PUT = async (req:Request, { params }: { params: { courseId: string, chapterId: string}}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401})

        const { chapterId, courseId } = params

        const { isCompleted } = await req.json();

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        })

        return NextResponse.json(userProgress)
    } catch (error) {
        console.log("MARK_COMPLETE", error)
        return new NextResponse('INTERNAL_ERROR', {status: 500})
    }
}