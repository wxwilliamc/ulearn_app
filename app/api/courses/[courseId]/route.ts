import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params} : { params: { courseId: string}}) => {
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