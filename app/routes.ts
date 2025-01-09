import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("contact", "routes/contact.tsx"),

  ...prefix("essays", [
    index("routes/essays/index.tsx"),
    route(":slug", "routes/essays/$slug.tsx"),
  ]),

  ...prefix("notes", [
    index("routes/notes/index.tsx"),
    route(":slug", "routes/notes/$slug.tsx"),
  ]),
] satisfies RouteConfig;
