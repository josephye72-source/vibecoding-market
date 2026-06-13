export type Route = {
  path: string;
  anchor?: string;
};

const topLevelAnchors = new Set(["projects", "path", "feedback"]);
const sectionAnchors = new Set([
  "detail-header",
  "online-demo",
  "learning-goals",
  "complexity-sources",
  "source-guide",
  "codex-doc",
  "prompt-zone",
  "faq",
  "remix-tasks"
]);

export function getRoute(hash: string): Route {
  const topLevelAnchor = hash.startsWith("#") ? hash.slice(1) : "";

  if (topLevelAnchors.has(topLevelAnchor)) {
    return { path: "/", anchor: `#${topLevelAnchor}` };
  }

  const rawPath = hash.replace(/^#/, "") || "/";
  const [path, query = ""] = rawPath.split("?");
  const section = new URLSearchParams(query).get("section");

  return {
    path,
    anchor: section && sectionAnchors.has(section) ? `#${section}` : undefined
  };
}
