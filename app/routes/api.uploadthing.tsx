import { createRouteHandler, createUploadthing } from "uploadthing/server";
import { FileRouter } from "uploadthing/types";

const f = createUploadthing();

export const uploadRouter = {
  videoAndImage: f({
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
  })
    .middleware(() => {
      // You should perform authentication here
      return { userId: "123" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export const { GET: loader, POST: action } = createRouteHandler({
  router: uploadRouter,
});
