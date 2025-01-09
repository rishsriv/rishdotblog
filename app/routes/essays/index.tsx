import { useLoaderData, Link } from "react-router";

export function loader() {
  // get links to all the essays from content/essays
  const essays = import.meta.glob("../../content/essays/*.mdx", { eager: true });

  const links = Object.keys(essays).map((path) => ({
    slug: path.replace("../../content/essays/", "").replace(".mdx", ""),
    // @ts-ignore
    title: essays[path].frontmatter?.title,
    // @ts-ignore
    published: essays[path].frontmatter?.published,
  }));
  return { links };
}

export function meta() {
  return [
    { title: "Rishabh's Essays'" },
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
            Essays
          </h1>
          {
            links.map(({ slug, title, published }) => (
              <div key={slug}>
                <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
                  <Link to={`/essays/${slug}`}>
                    {title}
                  </Link>
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
