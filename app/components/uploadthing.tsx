import React, { useRef, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  generateMimeTypes,
  generatePermittedFileTypes,
  genUploader,
  UploadAbortedError,
} from "uploadthing/client";
import { UploadRouter } from "../routes/api.uploadthing";

const uploadFiles = genUploader<UploadRouter>({
  url: new URL("http://localhost:5173/api/uploadthing"),
  package: "remix",
});

export default function CustomUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [canAbort, setCanAbort] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetcher = useFetcher();

  // Use the loader data
  const loaderData = useLoaderData<{
    config: ReturnType<typeof generatePermittedFileTypes>;
  }>();

  const { fileTypes, multiple } = loaderData.config;
  const acceptedTypes = generateMimeTypes(fileTypes).join(", ");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current?.files) return;

    const files = Array.from(inputRef.current.files);
    setIsUploading(true);
    setCanAbort(true);
    abortControllerRef.current = new AbortController();

    try {
      const res = await uploadFiles("videoAndImage", {
        files,
        signal: abortControllerRef.current.signal,
      });

      // Use fetcher to submit to the Remix action
      fetcher.submit({ files: JSON.stringify(res) }, { method: "post" });
    } catch (error) {
      if (error instanceof UploadAbortedError) {
        console.log("Upload aborted");
      } else {
        console.error("Upload error:", error);
      }
    } finally {
      setIsUploading(false);
      setCanAbort(false);
      if (formRef.current) formRef.current.reset();
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <>
      <div className="flex gap-4 p-6">
        <fetcher.Form ref={formRef} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes}
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
        </fetcher.Form>
        <button
          onClick={handleAbort}
          disabled={!canAbort}
          className="rounded-lg border border-transparent px-3 py-2 text-base font-medium bg-[#f9f9f9] dark:bg-[#1a1a1a] cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-webkit-focus-ring-color disabled:pointer-events-none disabled:opacity-50"
        >
          Abort
        </button>
      </div>
      {fetcher.data && (
        <div>
          <h2>Upload Result:</h2>
          <pre>{JSON.stringify(fetcher.data, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
