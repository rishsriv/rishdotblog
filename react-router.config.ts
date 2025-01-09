import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Use prerendering for every page, for now
  // this might get tedious in the future, if we have a lot of pages
  // at that point, we can consider using server side rendering
  // prerender: true,

  async prerender() {
    const essays = await import.meta.glob("./app/content/essays/*.mdx");
    const notes = await import.meta.glob("./app/content/notes/*.mdx");
    
    // get all the dynamic slugs explicitly listed here
    const essaySlugs = Object.keys(essays).map((path: string) => path.replace("app/content/", "/").replace(".mdx", ""));
    const noteSlugs = Object.keys(notes).map((path: string) => path.replace("app/content/", "/").replace(".mdx", ""));

    return ["/", "/contact", "/essays", "/notes"].concat(
      essaySlugs,
      noteSlugs
    );
  },
} satisfies Config;
