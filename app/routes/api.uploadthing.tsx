import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { generatePermittedFileTypes } from "uploadthing/client";
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

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

export const loader: LoaderFunction = async ({ request }) => {
  const data = await GET(request).json();
  const config = data.find(
    ({ slug }: { slug: string }) => slug === "videoAndImage"
  )?.config;
  return json({ config: generatePermittedFileTypes(config) });
};

export const action: ActionFunction = async ({ request }) => {
  const data = await POST(request).then((res) => res.json());
  return json(data);
};
