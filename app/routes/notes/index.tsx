import { useLoaderData, Link } from "react-router";

export function loader() {
  // get links to all the essays from content/essays
  const notes = import.meta.glob("../../content/*.mdx", { eager: true });

  const links = Object.keys(notes)
    .map((path) => ({
      slug: path.replace("../../content/", "").replace(".mdx", ""),
      // @ts-ignore
      title: notes[path].frontmatter?.title,
      // @ts-ignore
      published: notes[path].frontmatter?.published,
    }))
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
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
    <main className="flex items-center justify-center py-16">
      <div className="flex-1 flex flex-col items-center">
        <div className="max-w-[800px] w-full px-4">
          <header className="w-full mb-16 relative">
            <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-50 tracking-tight">
              Notes from books, podcasts, and tinkerings
            </h1>
          </header>
          
          <div className="w-full grid gap-8">
            {links.map(({ slug, title, published }) => (
              <a 
                key={slug}
                href={`/p/${slug}`}
                className="group relative p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-indigo-50/0 dark:from-indigo-900/0 dark:to-indigo-900/0 group-hover:from-indigo-50/50 dark:group-hover:from-indigo-900/10 rounded-xl transition-all duration-300" />
                
                <div className="relative">
                  <time className="block text-sm font-medium text-indigo-500/80 dark:text-indigo-400/80 mb-2">
                    {published}
                  </time>
                  
                  <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                    {title}
                  </h2>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
