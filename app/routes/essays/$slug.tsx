import { useLoaderData } from "react-router";
import { getPostBySlug } from "~/utils/mdx.server";
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

export async function loader({ params }: { params: { slug: string } }) {
  const essay = await getPostBySlug(params.slug, 'essays');
  
  if (!essay) {
    throw new Response("Essay not found", { status: 404 });
  }
  if (!essay.code) {
    throw new Response("Essay content is missing", { status: 500 });
  }

  return {
    code: essay.code,
    frontmatter: essay.frontmatter
  };
}

export function meta({ data }: { data: any }) {
  return [
    { title: `${data.frontmatter?.title} | Essays` },
    { name: "description", content: data.frontmatter?.description },
  ];
}

export default function EssayPost() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <MDXProvider>
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <div className="max-w-[800px] w-full space-y-6 px-4">
            <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
              <Component />
            </article>
          </div>
        </div>
      </main>
    </MDXProvider>
  );
}