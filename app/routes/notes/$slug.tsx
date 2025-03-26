import { useLoaderData } from "react-router";
import { getPostBySlug } from "~/utils/mdx.server";
import { MDXProvider } from '@mdx-js/react';
import React, { useEffect, useState } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll event to update progress bar
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initial calculation
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom MDX components with enhanced styling
  const components = {
    h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <>
        <div className="pt-8 mt-8" />
        <h2 
          {...props} 
          className="text-3xl font-semibold mb-8 pb-2 border-b border-gray-200 dark:border-gray-800 scroll-mt-16"
        />
      </>
    ),
    h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
      <>
        <div className="pt-4 mt-4" />
        <h3 
          {...props} 
          className="text-2xl font-semibold mb-6 scroll-mt-16"
        />
      </>
    ),
    p: (props: React.HTMLProps<HTMLParagraphElement>) => (
      <p {...props} className="my-6 leading-relaxed text-gray-700 dark:text-gray-300" />
    ),
    ul: (props: React.HTMLProps<HTMLUListElement>) => (
      <ul {...props} className="list-disc pl-6 space-y-2 my-6" />
    ),
    li: (props: React.HTMLProps<HTMLLIElement>) => (
      <li {...props} className="pl-2 text-gray-700 dark:text-gray-300" />
    ),
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <MDXProvider components={components}>
        <main className="flex items-center justify-center py-16">
          <div className="flex-1 flex flex-col items-center">
            <div className="max-w-[800px] w-full px-4">
              <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none
                prose-headings:font-display
                prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
                prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-ol:list-decimal prose-ol:my-6 prose-ol:space-y-4 prose-ol:pl-10
                prose-ol>li:relative prose-ol>li:pl-2 prose-ol>li:mb-2 prose-ol>li:before:content-none
                prose-ol>li:marker:font-semibold prose-ol>li:marker:text-gray-700 dark:prose-ol>li:marker:text-gray-300
                prose-pre:bg-gray-900 prose-pre:shadow-lg prose-pre:rounded-lg
                prose-pre:p-4 prose-pre:max-w-[calc(100vw-2rem)] prose-pre:overflow-x-auto
                prose-code:text-pink-500 dark:prose-code:text-pink-400
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900/50
                prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:pr-2 prose-blockquote:rounded-r prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
                <Component />
              </article>
            </div>
          </div>
        </main>
      </MDXProvider>
    </>
  );
}