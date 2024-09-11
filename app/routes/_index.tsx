import type {
  MetaFunction,
} from "@remix-run/node";
import CustomUploader from "~/components/uploadthing";

export const meta: MetaFunction = () => {
  return [
    { title: "Uploadthing x Remix" },
    {
      name: "description",
      content: "An example of using Uploadthing with Remix.",
    },
  ];
};


export default function Index() {
  return (
    <main className="max-w-screen-xl mx-auto p-8 text-center">
      <h1 className="text-3xl">Uploadthing x Remix</h1>
      <CustomUploader />
    </main>
  );
}
