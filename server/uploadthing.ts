import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  profilePhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
