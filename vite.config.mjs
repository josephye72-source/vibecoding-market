import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { defineConfig } from "vitest/config";

const docsSource = resolve("docs/projects");
const docsPublicPath = "/docs/projects/";
const sourcePublicPath = "/source/";

const sourceEntries = {
  "focus-pomodoro": [
    "src/demos/pomodoro/logic.ts",
    "src/demos/pomodoro/render.ts",
    "src/demos/pomodoro/logic.test.ts"
  ],
  "memory-cards": [
    "src/demos/memory/logic.ts",
    "src/demos/memory/render.ts",
    "src/demos/memory/logic.test.ts"
  ],
  "tiny-ledger": [
    "src/demos/ledger/logic.ts",
    "src/demos/ledger/render.ts",
    "src/demos/ledger/logic.test.ts"
  ],
  "habit-grid": [
    "src/demos/habits/logic.ts",
    "src/demos/habits/render.ts",
    "src/demos/habits/logic.test.ts"
  ],
  "split-console": [
    "src/demos/split/logic.ts",
    "src/demos/split/render.ts",
    "src/demos/split/logic.test.ts"
  ]
};

const contentTypes = {
  ".md": "text/markdown; charset=utf-8"
};

function sourceIndexFor(slug) {
  const files = sourceEntries[slug];

  if (!files) {
    return null;
  }

  return [
    `# ${slug} source entry`,
    "",
    "This static source entry is generated from the current repository files so readers can inspect the real implementation without a backend.",
    "",
    ...files.flatMap((repoPath) => [
      `## ${repoPath}`,
      "",
      "```ts",
      readFileSync(resolve(repoPath), "utf8"),
      "```",
      ""
    ])
  ].join("\n");
}

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

function sourceEntriesPlugin() {
  let resolvedOutDir = resolve("dist");
  let resolvedCommand = "serve";

  return {
    name: "vcm-source-entries",
    configResolved(config) {
      resolvedCommand = config.command;
      resolvedOutDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith(sourcePublicPath)) {
          next();
          return;
        }

        let requested;

        try {
          requested = decodeURIComponent(request.url.slice(sourcePublicPath.length).split("?")[0]);
        } catch {
          response.statusCode = 400;
          response.end("Bad request");
          return;
        }

        const pathParts = requested.split("/");
        const [slug, fileName] = pathParts;

        if (pathParts.length !== 2 || fileName !== "index.txt") {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        const body = sourceIndexFor(slug);

        if (!body) {
          response.statusCode = 404;
          response.end("Not found");
          return;
        }

        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.end(body);
      });
    },
    closeBundle() {
      if (resolvedCommand !== "build") {
        return;
      }

      for (const slug of Object.keys(sourceEntries)) {
        const sourceDir = resolve(resolvedOutDir, "source", slug);
        const body = sourceIndexFor(slug);

        if (!body) {
          continue;
        }

        mkdirSync(sourceDir, { recursive: true });
        writeFileSync(resolve(sourceDir, "index.txt"), body);
      }
    }
  };
}

export default defineConfig({
  plugins: [projectDocsPlugin(), sourceEntriesPlugin()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    setupFiles: ["./src/test/setup.ts"]
  }
});
