import { cpSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { defineConfig } from "vitest/config";

const docsSource = resolve("docs/projects");
const docsPublicPath = "/docs/projects/";

const contentTypes = {
  ".md": "text/markdown; charset=utf-8"
};

function projectDocsPlugin() {
  let resolvedOutDir = resolve("dist");
  let resolvedCommand = "serve";

  return {
    name: "vcm-project-docs",
    configResolved(config) {
      resolvedCommand = config.command;
      resolvedOutDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith(docsPublicPath)) {
          next();
          return;
        }

        let requested;

        try {
          requested = decodeURIComponent(request.url.slice(docsPublicPath.length).split("?")[0]);
        } catch {
          response.statusCode = 400;
          response.end("Bad request");
          return;
        }

        const filePath = resolve(docsSource, requested);
        const safeRelative = relative(docsSource, filePath);

        if (safeRelative.startsWith("..") || safeRelative.includes(`..${sep}`)) {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        let fileStats;

        try {
          fileStats = statSync(filePath);
        } catch {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        if (!fileStats.isFile()) {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        response.setHeader("Content-Type", contentTypes[extname(filePath)] ?? "text/plain; charset=utf-8");
        response.end(readFileSync(filePath));
      });
    },
    closeBundle() {
      if (resolvedCommand !== "build") {
        return;
      }

      const docsDist = resolve(resolvedOutDir, "docs/projects");

      if (existsSync(docsSource)) {
        mkdirSync(resolve(resolvedOutDir, "docs"), { recursive: true });
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
