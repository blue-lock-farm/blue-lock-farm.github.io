import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const root = process.cwd();
const output = join(root, "out");
const publicDir = join(root, "public");

writeFileSync(join(output, ".nojekyll"), "", "utf8");

const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN?.trim();
if (customDomain) writeFileSync(join(output, "CNAME"), `${customDomain}\n`, "utf8");

/** Move the inline gtag config snippet into <head> next to the gtag.js script. */
function hoistGtagInlineScript() {
  const generated = JSON.parse(readFileSync(join(root, "content/generated/integrations.json"), "utf8"));
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || generated.gaMeasurementId;
  if (!measurementId) return 0;

  let moved = 0;
  for (const absolute of walk(output)) {
    if (!absolute.endsWith(".html")) continue;
    let html = readFileSync(absolute, "utf8");
    const headEnd = html.indexOf("</head>");
    if (headEnd === -1) continue;
    const head = html.slice(0, headEnd);
    const body = html.slice(headEnd);
    if (body.includes(`gtag('config', '${measurementId}')`) || head.includes(`gtag('config', '${measurementId}')`)) {
      const inlineMatch = body.match(/<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];[\s\S]*?<\/script>/);
      if (!inlineMatch || head.includes(`gtag('config', '${measurementId}')`)) continue;
      const gtagScript = `<script async="" src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`;
      const anchor = head.indexOf(gtagScript);
      const insertAt = anchor === -1 ? headEnd : anchor + gtagScript.length;
      html = head.slice(0, insertAt) + inlineMatch[0] + head.slice(insertAt) + body.replace(inlineMatch[0], "");
      writeFileSync(absolute, html, "utf8");
      moved += 1;
    }
  }
  return moved;
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

/** Ensure technical verification files from public/ are present at the build output root. */
function ensureTechnicalPublicFiles() {
  if (!existsSync(publicDir) || !existsSync(output)) return [];
  const copied = [];
  for (const absolute of walk(publicDir)) {
    const local = relative(publicDir, absolute).split(sep).join("/");
    const base = local.split("/").pop() || "";
    const technical = /^google[a-z0-9_-]*\.html$/i.test(base)
      || /^(robots\.txt|ads\.txt)$/i.test(base)
      || local.startsWith(".well-known/");
    if (!technical) continue;
    const target = join(output, local);
    mkdirSync(dirname(target), { recursive: true });
    if (!existsSync(target)) {
      copyFileSync(absolute, target);
      copied.push(local);
    }
  }
  return copied;
}

const ensured = ensureTechnicalPublicFiles();
const gtagMoved = hoistGtagInlineScript();
console.log(
  customDomain
    ? `Static output prepared with CNAME ${customDomain}.`
    : "Static output prepared for GitHub Pages.",
);
if (ensured.length) {
  console.log(`Ensured technical public files in out/: ${ensured.join(", ")}`);
}
if (gtagMoved) {
  console.log(`Hoisted inline gtag config into <head> for ${gtagMoved} pages.`);
}
