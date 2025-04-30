import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Use prerendering for every page, for now
  // this might get tedious in the future, if we have a lot of pages
  // at that point, we can consider using server side rendering
  basename: "/",

  async prerender() {
    const notes = await import.meta.glob("./app/content/*.mdx");
    
    // get all the dynamic slugs explicitly listed here
    const noteSlugs = Object.keys(notes).map((path: string) => {
      // Extract filename without extension
      const filename = path.split('/').pop()?.replace('.mdx', '');
      // Create clean path
      return `/p/${filename}`;
    });

    return ["/", "/contact", "/notes", "/editor"].concat(
      noteSlugs
    );
  },
} satisfies Config;
