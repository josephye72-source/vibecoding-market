export type Route = {
  path: string;
  anchor?: string;
};

export function getRoute(hash: string): Route {
  if (hash === "#projects" || hash === "#path" || hash === "#feedback") {
    return { path: "/", anchor: hash };
  }

  const rawPath = hash.replace(/^#/, "") || "/";
  const [path, query = ""] = rawPath.split("?");
  const section = new URLSearchParams(query).get("section");

  return { path, anchor: section ? `#${section}` : undefined };
}
