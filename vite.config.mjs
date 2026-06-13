import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { defineConfig } from "vitest/config";

const docsSource = resolve("docs/projects");
const docsPublicPath = "/docs/projects/";

const contentTypes = {
  ".md": "text/markdown; charset=utf-8"
};

function projectDocsPlugin() {
  return {
    name: "vcm-project-docs",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith(docsPublicPath)) {
          next();
          return;
        }

        const requested = decodeURIComponent(request.url.slice(docsPublicPath.length).split("?")[0]);
        const filePath = resolve(docsSource, requested);
        const safeRelative = relative(docsSource, filePath);

        if (safeRelative.startsWith("..") || safeRelative.includes(`..${sep}`) || !existsSync(filePath)) {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        response.setHeader("Content-Type", contentTypes[extname(filePath)] ?? "text/plain; charset=utf-8");
        response.end(readFileSync(filePath));
      });
    },
    closeBundle() {
      const docsDist = resolve("dist/docs/projects");

      if (existsSync(docsSource)) {
        mkdirSync(resolve("dist/docs"), { recursive: true });
        cpSync(docsSource, docsDist, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  plugins: [projectDocsPlugin()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    setupFiles: ["./src/test/setup.ts"]
  }
});
