// URL : https://docs.uploadthing.com/nextjs/appdir

import { isMentor } from "@/lib/mentor";
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    const isAuthorized = isMentor(userId);
    if(!userId || !isAuthorized) throw new Error("Unauthorized");
    return { userId };
}
 
export const ourFileRouter = {
  courseImage: f({image: { maxFileSize: "16MB", maxFileCount: 1}})
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image","video","audio", "pdf"])
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
  chapterVideo: f({video: { maxFileSize: "128GB", maxFileCount: 1}})
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;