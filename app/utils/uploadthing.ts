import { UploadRouter } from "../routes/api.uploadthing";
import { generateReactHelpers, generateUploadButton } from "@uploadthing/react";

export const { useUploadThing} = generateReactHelpers<UploadRouter>({
  url: new URL("http://localhost:5173/api/uploadthing"),
});
export const UploadButton = generateUploadButton<UploadRouter>({
  url: new URL("http://localhost:5173/api/uploadthing"),
});