import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request, { params }: { params: { courseId: string, attachmentId: string }}) => {
    try {
        const { userId } = auth()
        if(!userId) return new NextResponse("Unauthorized", { status: 401})
        
        const { courseId, attachmentId } = params 

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401})
        }

        const attachments = await db.attachment.delete({
            where: {
                id: attachmentId,
                courseId
            }
        })

        return NextResponse.json(attachments)
    } catch (error) {
        console.log("[ATTACHMENT_ID]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}