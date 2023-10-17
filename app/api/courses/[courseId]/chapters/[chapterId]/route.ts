import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import Mux from '@mux/mux-node'
import { isMentor } from "@/lib/mentor";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
)

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

        // If user upload any chapter's video, check the video belongs to which chapter
        if(values.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            })

            // Delete the video if existing on the same chapter
            if(existingMuxData){
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where:{
                        id: existingMuxData.id
                    }
                })
            }

            // Replace with the latest upload video
            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: 'public',
                test: false
            })

            // Publish the data to db
            await db.muxData.create({
                data: {
                    chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id
                }
            })
        }

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("CHAPTER_ID_UPDATE", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params }: { params: { courseId: string, chapterId: string }}) => {
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

        const chapter = await db.chapter.findUnique({
            where:{
                id: chapterId,
                courseId
            },
        })

        if(!chapter) return new NextResponse("Not Found", { status: 404 })

        if(chapter.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            })

            // Delete the video if existing on the same chapter
            if(existingMuxData){
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where:{
                        id: existingMuxData.id
                    }
                })
            }
        }

        const chapterDelete = await db.chapter.delete({
            where: {
                id: chapterId
            }
        })

        const chaptersPublished = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })

        // the course only allow to publish if at least one chapter was published
        // if none of the chapters published in this course after the chapter deleted, the course will become not published.
        if(!chaptersPublished.length){
            await db.course.update({
                where:{
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(chapterDelete)
    } catch (error) {
        console.log("CHAPTER_ID_DELETE", error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}