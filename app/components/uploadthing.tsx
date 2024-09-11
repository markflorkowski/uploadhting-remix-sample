import React, { useRef, useState } from "react";
import {
  generatePermittedFileTypes,
} from "uploadthing/client";
import { UploadRouter } from "../routes/api.uploadthing";
import { generateReactHelpers } from "@uploadthing/react";

const { useUploadThing} = generateReactHelpers<UploadRouter>({
  url: new URL("http://localhost:5173/api/uploadthing"),
});

export default function CustomUploader() {
  const [canAbort, setCanAbort] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, url: string }[]>([]);

  const {routeConfig, startUpload, isUploading} = useUploadThing("videoAndImage", {
    signal: abortControllerRef.current?.signal,
    onClientUploadComplete: (res) => {
      setUploadedFiles(prev => prev.concat(res.map(file => ({name: file.name, url: file.url}))))
    }
  })
  const {fileTypes, multiple} = generatePermittedFileTypes(routeConfig)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current?.files) return;

    const files = Array.from(inputRef.current.files);
    setCanAbort(true);
    abortControllerRef.current = new AbortController();

    void startUpload(files)


  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <>
      <div className="flex gap-4 p-6">
        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="file"
            accept={fileTypes.join(",")}
            multiple={multiple}
            disabled={isUploading}
            className="bg-transparent text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-lg border border-transparent px-3 py-2 text-base font-medium bg-[#f9f9f9] dark:bg-[#1a1a1a] cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-webkit-focus-ring-color disabled:pointer-events-none"
          >
            Upload
          </button>
        </form>
        <button
          onClick={handleAbort}
          disabled={!canAbort}
          className="rounded-lg border border-transparent px-3 py-2 text-base font-medium bg-[#f9f9f9] dark:bg-[#1a1a1a] cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-webkit-focus-ring-color disabled:pointer-events-none disabled:opacity-50"
        >
          Abort
        </button>
      </div>
    <pre>
      {JSON.stringify(uploadedFiles, null, 2)}
    </pre>
    </>
  );
}
