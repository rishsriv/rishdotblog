import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";

type Frontmatter = {
  title?: string;
  published?: string;
  mediaType?: string;
  lessonType?: string;
};

export function loader() {
  const notes = import.meta.glob<Frontmatter>("../../content/book-notes/*.mdx", {
    eager: true,
    import: "frontmatter",
  });

  const items = Object.entries(notes)
    .map(([path, fm]) => ({
      slug: path.replace("../../content/book-notes/", "").replace(".mdx", ""),
      title: fm?.title ?? "Untitled",
      published: fm?.published ?? "",
      mediaType: fm?.mediaType ?? "Other",
      lessonType: fm?.lessonType ?? "",
    }))
    .sort((a, b) => (b.published || "").localeCompare(a.published || ""));

  return { items };
}

export function meta() {
  return [
    { title: "Book & podcast notes | Rishabh" },
    { name: "description", content: "Notes from books, podcasts, videos and articles" },
  ];
}

export default function BookNotes() {
  const { items } = useLoaderData<typeof loader>();
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => counts.set(i.mediaType, (counts.get(i.mediaType) ?? 0) + 1));
    return [["All", items.length] as const, ...[...counts.entries()].sort((a, b) => b[1] - a[1])];
  }, [items]);

  const visible = items.filter(
    (i) =>
      (type === "All" || i.mediaType === type) &&
      (!query || `${i.title} ${i.lessonType}`.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <main className="flex items-center justify-center py-16">
      <div className="flex-1 flex flex-col items-center">
        <div className="max-w-[800px] w-full px-4">
          <header className="w-full mb-10">
            <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-50 tracking-tight">
              Book &amp; podcast notes
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Notes and clippings from things I've read, watched and listened to.
            </p>
          </header>

          <div className="flex flex-wrap gap-2 mb-4">
            {types.map(([t, n]) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  type === t
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400"
                }`}
              >
                {t} <span className="opacity-70">{n}</span>
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles…"
            className="w-full mb-8 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {visible.map((i) => (
              <li key={i.slug}>
                <a href={`/book-notes/${i.slug}`} className="group flex items-baseline gap-4 py-3">
                  <time className="shrink-0 w-24 text-sm tabular-nums text-gray-500 dark:text-gray-400">
                    {i.published}
                  </time>
                  <span className="flex-1 text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {i.title}
                  </span>
                  <span className="hidden sm:block shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {i.mediaType}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {visible.length === 0 && <p className="text-gray-500">No notes match.</p>}
        </div>
      </div>
    </main>
  );
}
