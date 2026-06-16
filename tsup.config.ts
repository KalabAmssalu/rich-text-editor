import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

function bundlePackageStyles(outDir: string) {
  const cssFiles = [
    join(__dirname, "src/lexical/mentions-popover.css"),
    join(__dirname, "src/styles/editor-theme.css"),
  ];
  const bundled = cssFiles
    .map((file) => readFileSync(file, "utf8"))
    .join("\n\n");
  writeFileSync(join(outDir, "styles.css"), bundled, "utf8");
}

export default defineConfig({
  entry: ["src/index.ts", "src/box.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^@lexical\//,
    "lexical",
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    const outDir = join(__dirname, "dist");
    mkdirSync(outDir, { recursive: true });
    bundlePackageStyles(outDir);
  },
});
