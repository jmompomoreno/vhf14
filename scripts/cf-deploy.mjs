// Comando de despliegue para Cloudflare Workers Builds (o manual: node scripts/cf-deploy.mjs).
// Genera una configuración limpia a partir de wrangler.jsonc y publica el Worker.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const strip = (s) => s.replace(/^\s*\/\/.*$/gm, "").replace(/,(\s*[}\]])/g, "$1");
const root = JSON.parse(strip(readFileSync("wrangler.jsonc", "utf8")));
const d1 = root.d1_databases[0];
const cfg = {
  name: root.name,
  main: "index.js",
  compatibility_date: root.compatibility_date,
  compatibility_flags: root.compatibility_flags,
  no_bundle: true,
  rules: [{ type: "ESModule", globs: ["**/*.js", "**/*.mjs"] }],
  assets: { directory: "../client" },
  d1_databases: [{ binding: d1.binding, database_name: d1.database_name, database_id: d1.database_id }],
};
writeFileSync("dist/server/wrangler.json", JSON.stringify(cfg, null, 2));
const r = spawnSync("npx wrangler deploy --config dist/server/wrangler.json", { shell: true, stdio: "inherit" });
process.exit(r.status ?? 1);
