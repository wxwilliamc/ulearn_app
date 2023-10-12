import { db } from "@/lib/db";
import { newCourseTitleSchema } from "@/schema/form";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse("Unauthorized", { status: 401 })

        const body = await req.json();
        const { title } = newCourseTitleSchema.parse(body);

        const course = await db.course.create({
            data:{
                userId,
                title,
            }
        })

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}