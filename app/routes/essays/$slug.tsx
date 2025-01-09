import { useLoaderData } from "react-router";
import { getEssayBySlug } from "~/utils/mdx.server";
import { renderFromRawElement } from "~/utils/parsing";

export async function loader({ params }: { params: { slug: string } }) {
  const essay = getEssayBySlug(params.slug);
  if (!essay) {
    throw new Response("Not Found", { status: 404 });
  }
  console.log("Loading...");
  return { content: essay.default(), frontmatter: essay.frontmatter };
}

export function meta({ data }: { data: any }) {
  return [
    { title: `${data.frontmatter?.title} | Essays` },
    { name: "description", content: data.frontmatter?.description },
  ];
}

export default function EssayPost() {
  const { content, frontmatter } = useLoaderData<typeof loader>();
  const renderedContent = content?.props?.children || [];

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
            {renderedContent.map((node: any, index: number) => renderFromRawElement(node, index))}
          </article>
        </div>
      </div>
    </main>
  );
}