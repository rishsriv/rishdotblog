import { useLoaderData, Link } from "react-router";

export function loader() {
  // get links to all the essays from content/essays
  const notes = import.meta.glob("../../content/notes/*.mdx", { eager: true });

  const links = Object.keys(notes).map((path) => ({
    slug: path.replace("../../content/notes/", "").replace(".mdx", ""),
    // @ts-ignore
    title: notes[path].frontmatter?.title,
    // @ts-ignore
    published: notes[path].frontmatter?.published,
  }));
  return { links };
}

export function meta() {
  return [
    { title: "Rishabh's Notes" },
    { name: "description", content: "Essays" },
  ];
}

export default function Home() {
  const { links } = useLoaderData<typeof loader>();
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <h1 className="font-bold text-3xl text-gray-700 dark:text-gray-200">
            Notes from books, podcasts, and tinkerings
          </h1>
          {
            links.map(({ slug, title, published }) => (
              <div key={slug}>
                <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
                  {/*
                    we use <a> tags instead of <Link> tags here. This is because we statically pre-render the essays
                    using Link on client-side navigation would cause the loader to _expect_ a server response
                    but since we don't have a server with SSG, we don't want that. So we use plain html anchor tags
                  */}
                  <a href={`/notes/${slug}`} className="hover:underline text-2xl text-gray-700 dark:text-gray-200">
                    {title}
                  </a>
                </h2>
                <p className="text-gray-700 dark:text-gray-200">
                  {published}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </main>
  );
}
