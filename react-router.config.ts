import type { Config } from "@react-router/dev/config";
import { prerender } from "react-dom/static";

export default {
  // Config options...
  // Use prerendering for every page, for now
  // this might get tedious in the future, if we have a lot of pages
  // at that point, we can consider using server side rendering
  prerender: true,
} satisfies Config;
