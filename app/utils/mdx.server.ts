export const getEssayBySlug = (slug: string) : { default: () => any, frontmatter: Object} => {
  const essays = import.meta.glob("../content/essays/*.mdx", { eager: true });
  // @ts-ignore
  return essays[`../content/essays/${slug}.mdx`];
};

export const getNotesBySlug = (slug: string) : { default: () => any, frontmatter: Object} => {
  const notes = import.meta.glob("../content/notes/*.mdx", { eager: true });
  // @ts-ignore
  return notes[`../content/notes/${slug}.mdx`];
};