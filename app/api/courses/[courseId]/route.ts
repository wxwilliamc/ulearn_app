import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import Mux from '@mux/mux-node'

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

export const PATCH = async (req: Request, { params } : { params: { courseId: string}}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const body = await req.json();
        const { courseId } = params;

        const course = await db.course.update({
            where: {
                userId,
                id: courseId
            },
            data: {
                ...body,
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { courseId: string}}) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const { courseId } = params

        const course = await db.course.findUnique({
            where:{
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        })

        if(!course) return new NextResponse("Not Found", { status: 401 })

        for (const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await Video.Assets.del(chapter.muxData.assetId)
            }
        }

        const deleteCourse = await db.course.delete({
            where: {
                id: courseId
            }
        })

        return new NextResponse("Course Deleted", { status: 200 })
    } catch (error) {
        console.log("COURSE_DELETE", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}