export const getEssayBySlug = (slug: string) => {
  const essays = import.meta.glob("../content/essays/*.mdx", { eager: true });
  return essays[`../content/essays/${slug}.mdx`];
};