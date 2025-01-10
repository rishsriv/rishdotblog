import { useLoaderData } from "react-router";
import { getNotesBySlug } from "~/utils/mdx.server";
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

export async function loader({ params }: { params: { slug: string } }) {
  const note = await getNotesBySlug(params.slug);
  if (!note) {
    throw new Response("Note not found", { status: 404 });
  }
  if (!note.code) {
    throw new Response("Note content is missing", { status: 500 });
  }

  return {
    code: note.code,
    frontmatter: note.frontmatter
  };
}

export function meta({ data }: { data: any }) {
  return [
    { title: `${data.frontmatter?.title} | Notes` },
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