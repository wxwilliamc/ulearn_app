import { db } from '@/lib/db';

const retrieveProgress = async (userId: string, courseId: string): Promise<number> => {
    
    try {
        // find all the chapter within the course is published
        const chaptersPublished = await db.chapter.findMany({
            where:{
                id: courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        })

        // map the total chapter
        const chaptersPublishedIds = chaptersPublished.map((chapter) => chapter.id)

        // find which chapter isCompleted
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: chaptersPublishedIds
                },
                isCompleted: true
            }
        })

        const statusPercentage = (validCompletedChapters / chaptersPublishedIds.length) * 100;

        return statusPercentage;
    } catch (error) {
        console.log("[PROGRESS_RETRIEVE]", error)
        return 0;
    }
}

export default retrieveProgress