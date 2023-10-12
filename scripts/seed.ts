// push some pre-default data to db such as category, cause we don't have any features like create a new category in this project.

const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data: [
                { name: "AI and Robotics"},
                { name: "Art and Music"},
                { name: "Business and Entrepreneurship"},
                { name: "Cooking and Culinary Arts"},
                { name: "Data Science and Machine Learning"},
                { name: "Digital Marketing"},
                { name: "Education and Teaching"},
                { name: "Finance and Investing"},
                { name: "Game Development"},
                { name: "Graphic Design and Video Editing"},
                { name: "Health and Fitness"},
                { name: "Language Learning"},
                { name: "Personal Development"},
                { name: "Photography and Videography"},
                { name: "Programming and Development"},
            ]
        })
    } catch (error) {
        console.log("Error sending the database categories", error)
    } finally {
        await database.$disconnect();
    }
}

main();