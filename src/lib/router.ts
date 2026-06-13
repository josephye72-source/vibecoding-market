export type Route = {
  path: string;
  anchor?: string;
};

export function getRoute(hash: string): Route {
  if (hash === "#projects" || hash === "#path") {
    return { path: "/", anchor: hash };
  }

  return { path: hash.replace(/^#/, "") || "/" };
}
