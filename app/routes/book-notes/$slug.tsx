import { useLoaderData } from "react-router";
import { getPostBySlug } from "~/utils/mdx.server";
import NoteArticle from "~/components/NoteArticle";

export async function loader({ params }: { params: { slug: string } }) {
  const note = await getPostBySlug(params.slug, "book-notes");
  if (!note?.code) {
    throw new Response("Note not found", { status: 404 });
  }
  return { code: note.code, frontmatter: note.frontmatter };
}

export function meta({ data }: { data: any }) {
  return [
    { title: `${data?.frontmatter?.title} | Book notes` },
    { name: "description", content: data?.frontmatter?.description },
  ];
}

export default function BookNote() {
  const { code } = useLoaderData<typeof loader>();
  return <NoteArticle code={code} />;
}
