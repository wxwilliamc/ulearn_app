
import { db } from "@/lib/db"
import { Attachment, Chapter } from "@prisma/client"

interface RetrieveChaptersProps {
    userId: string
    courseId: string
    chapterId: string
}

const RetrieveChapters = async ({ userId, courseId, chapterId }: RetrieveChaptersProps) => {
  try {
    const purchase = await db.purchase.findUnique({
        where:{
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    const course = await db.course.findUnique({
        where: {
            isPublished: true,
            id: courseId
        },
        select: {
            price: true
        }
    })

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            isPublished: true
        }
    })

    if(!chapter || !course){
        throw new Error("Chapter / Course not found!")
    }

    let muxData = null;
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null

    if(purchase){
        attachments = await db.attachment.findMany({
            where: {
                courseId
            }
        })
    }

    if(chapter.isFree || purchase){
        muxData = await db.muxData.findUnique({
            where: {
                chapterId
            }
        })

        nextChapter = await db.chapter.findFirst({
            where:{
                courseId,
                isPublished: true,
                position: {
                    gt: chapter?.position // greater than current chapter position
                }
            },
            orderBy: {
                position: 'asc'
            }
        })
    }

    const userProgress = await db.userProgress.findUnique({
        where: {
            userId_chapterId: {
                userId,
                chapterId
            }
        }
    })

    return {
        purchase,
        course,
        chapter,
        userProgress,
        muxData,
        attachments,
        nextChapter,
    }

  } catch (error) {
    console.log("RETRIEVE_CHAPTERS", error)
    return {
        chapter: null,
        course: null,
        muxData: null,
        attachments: [],
        nextChapter: null,
        userProgress: null,
        purchase: null,
    }
  }
}

export default RetrieveChapters