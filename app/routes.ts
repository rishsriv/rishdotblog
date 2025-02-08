import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("contact", "routes/contact.tsx"),
  route("editor", "routes/editor.jsx"),

  route("notes", "routes/notes/index.tsx"),
  ...prefix("p", [
    
    route(":slug", "routes/notes/$slug.tsx"),
  ]),
] satisfies RouteConfig;
