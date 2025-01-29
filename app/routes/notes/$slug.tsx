import { getPostBySlug } from "~/utils/mdx.server";
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { useLoaderData, useFetcher } from "react-router";

export async function loader({ params }: { params: { slug: string } }) {
  const note = await getPostBySlug(params.slug);
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
  const fetcher = useFetcher();
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (fetcher.data) {
      setMessage(fetcher.data.message);
      if (fetcher.data.success) {
        // Clear form on success
        const form = document.querySelector('form');
        if (form) form.reset();
      }
    }
  }, [fetcher.data]);

  return (
    <MDXProvider>
      <main className="flex items-center justify-center py-16">
        <div className="flex-1 flex flex-col items-center">
          <div className="max-w-[800px] w-full px-4">
            <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none
              prose-headings:font-display
              prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
              prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-ul:my-6 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
              prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:h-1.5 prose-li:before:w-1.5 prose-li:before:rounded-full prose-li:before:bg-gray-400 dark:prose-li:before:bg-gray-600
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-4
              prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:rounded-lg
              prose-pre:p-4 prose-pre:max-w-[calc(100vw-2rem)] prose-pre:overflow-x-auto
              prose-code:text-pink-500 dark:prose-code:text-pink-400
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900/50
              prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:pr-2 prose-blockquote:rounded-r prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
              <Component />
            </article>

            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
              <fetcher.Form
                method="post"
                action="/api/subscribe"
                className="max-w-md mx-auto"
              >
                <h3 className="text-xl font-semibold mb-4">Sign up for updates</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Get notified when I publish new articles</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </div>
                {message && (
                  <p className={`mt-2 text-sm ${fetcher.data?.success ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </fetcher.Form>
            </div>
          </div>
        </div>
      </main>
    </MDXProvider>
  );
}