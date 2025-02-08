import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Use prerendering for every page, for now
  // this might get tedious in the future, if we have a lot of pages
  // at that point, we can consider using server side rendering
  // prerender: true,

  async prerender() {
    const notes = await import.meta.glob("./app/content/*.mdx");
    
    // get all the dynamic slugs explicitly listed here
    const noteSlugs = Object.keys(notes).map((path: string) => path.replace("app/content/", "/p/").replace(".mdx", ""));

    return ["/", "/contact", "/notes", "/editor"].concat(
      noteSlugs
    );
  },
} satisfies Config;
