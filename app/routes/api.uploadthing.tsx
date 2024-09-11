import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
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

const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

export const loader: LoaderFunction = (event) => GET(event).json(); 

export const action: ActionFunction = async (event) => {
  const data = await POST(event).then((res) => res.json());
  return json(data);
};
