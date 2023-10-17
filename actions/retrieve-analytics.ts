import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if(!grouped[courseTitle]){
            grouped[courseTitle] = 0
        }
        grouped[courseTitle] += purchase.course.price!
    })

    return grouped
}

export const retrieveAnalytics = async (userId: string) => {
    try {
        const purchases =  await db.purchase.findMany({
            where:{
                course: {
                    userId
                }
            },
            include: {
                course: true
            }
        })

        const groupedProfits = groupByCourse(purchases)

        const data = Object.entries(groupedProfits).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }))

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
        const totalSales = purchases.length

        return {
            totalRevenue,
            totalSales,
            data,
        }
    } catch (error) {
        console.log("RETRIEVE_ANALYTICS", error)
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0
        }
    }
}