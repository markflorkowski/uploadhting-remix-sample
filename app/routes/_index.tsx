import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { generatePermittedFileTypes } from "uploadthing/client";
import CustomUploader from "~/components/uploadthing";
import { GET, POST } from "./api.uploadthing";

export const meta: MetaFunction = () => {
  return [
    { title: "Uploadthing x Remix" },
    {
      name: "description",
      content: "An example of using Uploadthing with Remix.",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = await GET(request);
  const data = await response.json();
  const config = data.find(
    ({ slug }: { slug: string }) => slug === "videoAndImage"
  )?.config;
  return json({ config: generatePermittedFileTypes(config) });
};

export const action: ActionFunction = async ({ request }) => {
  const data = await POST(request).then((res) => res.json());
  return json(data);
};

export default function Index() {
  return (
    <main className="max-w-screen-xl mx-auto p-8 text-center">
      <h1 className="text-3xl">Uploadthing x Remix</h1>
      <CustomUploader />
    </main>
  );
}
