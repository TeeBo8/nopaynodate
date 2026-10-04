import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { isDemo } from "@/lib/demo";

const f = createUploadthing();

export const ourFileRouter = {
  profilePhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 6 } })
    .middleware(async () => {
      if (isDemo) throw new Error("Uploads are disabled in the demo");
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
