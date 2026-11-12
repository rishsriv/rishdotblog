#!/usr/bin/env node
// Import a Notion "Markdown & CSV" export into this blog.
//
// Usage: node scripts/import-notion.mjs "<path to the export's root page folder's parent>"
//   e.g. node scripts/import-notion.mjs ~/Downloads/personal_site/f9dbaa56-..._Export-3f57cf0c-...
//
// What it does:
//   - Blog posts, Resources pages and About Me  -> app/content/<slug>.mdx        (served at /p/<slug>)
//   - Everything else (book/podcast notes, clipped articles, nested sub-pages)
//                                               -> app/content/book-notes/<slug>.mdx (served at /book-notes/<slug>)
//   - Images and other attachments              -> public/notion/<slug>/...
//   - Links between Notion pages are rewritten to the new URLs; inline databases become tables.
//
// Re-running is safe: previously imported files (frontmatter `source: notion`), app/content/book-notes
// and public/notion are deleted first.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import { visit, SKIP } from "unist-util-visit";
import { execFileSync } from "node:child_process";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(REPO, "app/content");
const NOTES_DIR = path.join(REPO, "app/content/book-notes");
const ASSET_DIR = path.join(REPO, "public/notion");

const exportRoot = process.argv[2] && path.resolve(process.argv[2]);
if (!exportRoot || !fs.existsSync(exportRoot)) {
  console.error("Usage: node scripts/import-notion.mjs <notion export folder>");
  process.exit(1);
}

// ---------- helpers ----------
const ID_RE = /([0-9a-f]{32})/;
const idOf = (p) => (path.basename(p).match(/ ([0-9a-f]{32})(?:\.md|\.csv)?$/) || [])[1];
const stripId = (s) => s.replace(/ [0-9a-f]{32}(_all)?(\.md|\.csv)?$/, "").trim();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function slugify(s) {
  return (
    s
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/, "") || "untitled"
  );
}

function toISODate(s) {
  if (!s) return undefined;
  const d = new Date(s);
  if (isNaN(d.getTime())) return undefined;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim()));
}

function sniffExt(file) {
  const b = Buffer.alloc(12);
  const fd = fs.openSync(file, "r");
  fs.readSync(fd, b, 0, 12, 0);
  fs.closeSync(fd);
  if (b[0] === 0x89 && b[1] === 0x50) return ".png";
  if (b[0] === 0xff && b[1] === 0xd8) return ".jpg";
  if (b.slice(0, 3).toString() === "GIF") return ".gif";
  if (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP") return ".webp";
  if (b.slice(0, 4).toString() === "%PDF") return ".pdf";
  return "";
}

const isRelative = (url) => url && !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith("#") && !url.startsWith("/");
const safeDecode = (u) => { try { return decodeURIComponent(u); } catch { return u; } };

const textOf = (node) =>
  node.value != null ? node.value : (node.children || []).map(textOf).join("");

// ---------- clean previous import ----------
fs.rmSync(NOTES_DIR, { recursive: true, force: true });
fs.rmSync(ASSET_DIR, { recursive: true, force: true });
for (const f of fs.readdirSync(POSTS_DIR)) {
  const p = path.join(POSTS_DIR, f);
  if (f.endsWith(".mdx") && /^source: notion$/m.test(fs.readFileSync(p, "utf8").split(/^---$/m)[1] || ""))
    fs.rmSync(p);
}
fs.mkdirSync(NOTES_DIR, { recursive: true });
fs.mkdirSync(ASSET_DIR, { recursive: true });

// ---------- discover ----------
const allFiles = walk(exportRoot);
const mdFiles = allFiles.filter((f) => f.endsWith(".md"));
const rootMd = mdFiles.filter((f) => path.dirname(f) === exportRoot);
if (rootMd.length !== 1) throw new Error(`Expected exactly one root page in ${exportRoot}, found ${rootMd.length}`);
const ROOT = rootMd[0].replace(/\.md$/, ""); // folder holding all sub-pages

// CSV metadata: "<db folder>|<name>" -> row object. Prefer the *_all.csv (all rows) variant.
const csvRows = new Map();
const propKeys = new Set(["Created", "Created at", "Lesson Type", "Media Type", "Project", "URL", "Tags", "Added By", "Source URL"]);
for (const f of allFiles.filter((f) => f.endsWith(".csv"))) {
  const [header, ...rows] = parseCSV(fs.readFileSync(f, "utf8"));
  header.forEach((h) => h !== "Name" && propKeys.add(h.trim()));
  const dbFolder = f.replace(/(_all)?\.csv$/, "");
  for (const r of rows) {
    const obj = Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] || "").trim()]));
    const key = dbFolder + "|" + (obj.Name || "").replace(/\s+/g, " ").trim();
    if (!csvRows.has(key) || f.endsWith("_all.csv")) csvRows.set(key, obj);
  }
}

// Classify pages
const pages = []; // {file, id, title, section, slug, url, unlisted}
const urlById = new Map();
const urlByFile = new Map();
const usedSlugs = { post: new Set(fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4))), note: new Set() };
const skipped = [];

for (const file of mdFiles) {
  const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const title = ((raw.match(/^# (.+)$/m) || [])[1] || stripId(path.basename(file))).trim();
  const rel = path.relative(ROOT, file).split(path.sep);
  const id = idOf(file);
  let section, url, unlisted = false;

  if (file === rootMd[0]) { url = "/"; }
  else if (rel.length === 1 && /^(Blog|Resources) /.test(rel[0])) { url = "/notes"; }
  else if (rel.length === 2 && /^(Blog|Resources) /.test(rel[0])) {
    if (title === "Blog title") { skipped.push(`template: ${path.relative(exportRoot, file)}`); continue; }
    section = "post";
  } else if (/^About Me /.test(rel[0])) { section = "post"; unlisted = true; }
  else section = "note";

  if (section) {
    let slug = slugify(title), n = 2;
    while (usedSlugs[section].has(slug)) slug = `${slugify(title)}-${n++}`;
    usedSlugs[section].add(slug);
    url = section === "post" ? `/p/${slug}` : `/book-notes/${slug}`;
    pages.push({ file, raw, id, title, section, slug, url, unlisted });
  }
  if (id) urlById.set(id, url);
  urlByFile.set(file, url);
}
// Database folders (no .md of their own) -> listing page
urlById.set(idOf(path.join(ROOT, fs.readdirSync(ROOT).find((n) => n.startsWith("Book and Podcast Notes ") && n.endsWith(".csv")) || "x")), "/book-notes");

// ---------- convert ----------
const stringifier = unified()
  .use(remarkGfm)
  .use(remarkMdx)
  .use(remarkStringify, { bullet: "-", emphasis: "*", strong: "*", rule: "-", fences: true });
const parser = unified().use(remarkParse).use(remarkGfm);

const copiedAssets = new Map(); // src -> public url
let assetBytes = 0;
const warnings = [];

function copyAsset(src, slug) {
  if (copiedAssets.has(src)) return copiedAssets.get(src);
  let name = path.basename(src).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+/, "");
  if (!path.extname(name) || path.extname(name).length > 5) name += sniffExt(src);
  const destDir = path.join(ASSET_DIR, slug);
  fs.mkdirSync(destDir, { recursive: true });
  let dest = path.join(destDir, name), n = 2;
  while (fs.existsSync(dest)) dest = path.join(destDir, name.replace(/(\.[^.]*)?$/, `-${n++}$1`));
  fs.copyFileSync(src, dest);
  shrinkImage(dest);
  assetBytes += fs.statSync(dest).size;
  const url = "/" + path.relative(path.join(REPO, "public"), dest).split(path.sep).map(encodeURIComponent).join("/");
  copiedAssets.set(src, url);
  return url;
}

// Downscale big screenshots/photos (longest side 1600px). macOS only (uses `sips`); skipped elsewhere.
function shrinkImage(file) {
  if (process.platform !== "darwin" || !/\.(png|jpe?g)$/i.test(file) || fs.statSync(file).size < 300_000) return;
  try {
    const info = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
    const [w, h] = [...info.matchAll(/pixel(?:Width|Height): (\d+)/g)].map((m) => +m[1]);
    if (Math.max(w, h) > 1600) execFileSync("sips", ["-Z", "1600", file], { stdio: "ignore" });
  } catch {
    warnings.push(`could not resize ${file}`);
  }
}

function resolveUrl(url, page) {
  if (!url) return url;
  if (isRelative(url)) {
    // Notion filenames can contain '#' or '?', so only treat them as fragment/query if the literal path doesn't exist
    let target = path.resolve(path.dirname(page.file), safeDecode(url));
    if (!fs.existsSync(target)) target = path.resolve(path.dirname(page.file), safeDecode(url.split("#")[0].split("?")[0]));
    if (urlByFile.has(target)) return urlByFile.get(target);
    const id = idOf(target);
    if (id && urlById.has(id)) return urlById.get(id);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return copyAsset(target, page.slug);
    warnings.push(`${page.url}: broken relative link ${url}`);
    return url;
  }
  if (/notion\.(so|site)/.test(url)) {
    const id = (url.split("?")[0].match(/([0-9a-f]{32})(?:$|[^0-9a-f])/) || [])[1];
    if (id && urlById.has(id)) return urlById.get(id);
  }
  return url;
}

function csvToTable(csvPath, page) {
  const allPath = csvPath.replace(/\.csv$/, "_all.csv");
  const [header, ...rows] = parseCSV(fs.readFileSync(fs.existsSync(allPath) ? allPath : csvPath, "utf8"));
  const dbFolder = csvPath.replace(/\.csv$/, "");
  const cell = (s, linkUrl) => {
    const text = { type: "text", value: s.replace(/\s*\n\s*/g, " ") };
    return { type: "tableCell", children: linkUrl ? [{ type: "link", url: linkUrl, children: [text] }] : [text] };
  };
  const nameIdx = header.findIndex((h) => h.trim() === "Name");
  // find sub-page for each row by title
  const subPages = pages.filter((p) => path.dirname(p.file) === dbFolder);
  return {
    type: "table",
    align: header.map(() => null),
    children: [
      { type: "tableRow", children: header.map((h) => cell(h.trim())) },
      ...rows.map((r) => ({
        type: "tableRow",
        children: header.map((_, i) => {
          const v = (r[i] || "").trim();
          if (i === nameIdx) return cell(v, subPages.find((p) => p.title === v)?.url);
          if (/^https?:\/\/\S+$/.test(v)) return cell(v, resolveUrl(v, page));
          return cell(v);
        }),
      })),
    ],
  };
}

for (const page of pages) {
  let body = page.raw;
  // Notion callouts: <aside>…</aside> -> blockquote
  body = body.replace(/^<aside>[ \t]*\n([\s\S]*?)\n<\/aside>[ \t]*$/gm, (_, inner) =>
    inner.split("\n").map((l) => (l.trim() ? "> " + l : ">")).join("\n"));
  // Title
  body = body.replace(/^# .+\n?/, "");
  // Property block right after the title ("Media Type: Books" lines)
  const props = {};
  body = body.replace(/^\s*((?:[^\n]+\n?)+?)(?:\n\s*\n|$)/, (block) => {
    const lines = block.trim().split("\n");
    const parsed = lines.map((l) => l.match(/^([^:]{1,30}): ?(.*)$/));
    if (!parsed.every((m) => m && propKeys.has(m[1].trim()))) return block;
    parsed.forEach((m) => (props[m[1].trim()] = m[2].trim()));
    return "\n";
  });
  const csvMeta = csvRows.get(path.dirname(page.file) + "|" + page.title.replace(/\s+/g, " ")) || {};
  const meta = { ...csvMeta, ...props };

  const tree = parser.parse(body);

  // Blog posts: "subtitle / date / ---" header
  let description, published = toISODate(meta.Created || meta["Created at"]);
  if (page.section === "post") {
    const hr = tree.children.findIndex((n) => n.type === "thematicBreak");
    if (hr >= 0 && hr <= 2 && tree.children.slice(0, hr).every((n) => n.type === "paragraph")) {
      for (const p of tree.children.slice(0, hr)) {
        const t = textOf(p).trim();
        if (/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(t)) published = toISODate(t);
        else description = t;
      }
      tree.children.splice(0, hr + 1);
    }
  }

  // Notion puts a `---` under section headings; the blog's h2 already has a rule, so drop those
  tree.children = tree.children.filter((n, i, arr) => !(n.type === "thematicBreak" && arr[i - 1]?.type === "heading"));

  // Inline databases: a paragraph that is just a link to a .csv -> table
  tree.children = tree.children.flatMap((n) => {
    if (n.type === "paragraph" && n.children.length === 1 && n.children[0].type === "link" && /\.csv$/i.test(n.children[0].url)) {
      const csvPath = path.resolve(path.dirname(page.file), safeDecode(n.children[0].url));
      if (fs.existsSync(csvPath))
        return [{ type: "paragraph", children: [{ type: "strong", children: n.children[0].children }] }, csvToTable(csvPath, page)];
    }
    return [n];
  });

  visit(tree, (node, index, parent) => {
    if (node.type === "heading") node.depth = Math.min(node.depth + 1, 6);
    if (node.type === "image") {
      node.url = resolveUrl(node.url, page);
      if (/%20|\//.test(node.alt || "") || /^untitled/i.test(node.alt || "")) node.alt = "";
    }
    if (node.type === "link") node.url = resolveUrl(node.url, page);
    if (node.type === "definition") node.url = resolveUrl(node.url, page);
    if (node.type === "html" && parent) {
      const flow = ["root", "blockquote", "listItem"].includes(parent.type);
      parent.children[index] = flow
        ? { type: "paragraph", children: [{ type: "text", value: node.value }] }
        : { type: "text", value: node.value };
      return SKIP;
    }
  });

  // Header: H1 title (+ source line for notes)
  const header = [{ type: "heading", depth: 1, children: [{ type: "text", value: page.title }] }];
  if (page.section === "note") {
    const bits = [meta["Media Type"], meta["Lesson Type"] || meta.Tags].filter(Boolean).join(" · ");
    const src = meta.URL || meta["Source URL"];
    const children = [];
    if (bits) children.push({ type: "emphasis", children: [{ type: "text", value: bits }] });
    if (src && /^https?:\/\//.test(src)) {
      if (children.length) children.push({ type: "text", value: " · " });
      children.push({ type: "link", url: resolveUrl(src, page), children: [{ type: "text", value: "Source" }] });
    }
    if (children.length) header.push({ type: "paragraph", children });
  } else if (description) {
    header.push({ type: "paragraph", children: [{ type: "emphasis", children: [{ type: "text", value: description }] }] });
  }
  tree.children.unshift(...header);

  const fm = {
    title: page.title,
    description: description || (page.section === "note" ? [meta["Media Type"], "notes"].filter(Boolean).join(" ") : undefined),
    published,
    public: true,
    unlisted: page.unlisted || undefined,
    mediaType: meta["Media Type"] || undefined,
    lessonType: meta["Lesson Type"] || meta.Tags || undefined,
    project: meta.Project || undefined,
    url: meta.URL || meta["Source URL"] || undefined,
    source: "notion",
  };
  page.fm = fm;
  page.tree = tree;
}

// Sub-pages without their own date inherit the nearest dated ancestor page's date
const byFolder = new Map(pages.map((p) => [p.file.replace(/\.md$/, ""), p]));
for (const page of pages) {
  for (let dir = path.dirname(page.file); !page.fm.published && dir.startsWith(ROOT) && dir !== ROOT; dir = path.dirname(dir))
    page.fm.published = byFolder.get(dir)?.fm.published;
}

for (const page of pages) {
  const yaml = Object.entries(page.fm)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${k === "source" || typeof v === "boolean" ? v : JSON.stringify(v)}`)
    .join("\n");
  const out = `---\n${yaml}\n---\n\n${stringifier.stringify(page.tree)}`;
  fs.writeFileSync(path.join(page.section === "post" ? POSTS_DIR : NOTES_DIR, `${page.slug}.mdx`), out);
}

const count = (s) => pages.filter((p) => p.section === s).length;
console.log(`posts: ${count("post")}, notes: ${count("note")}, assets: ${copiedAssets.size} (${(assetBytes / 1e6).toFixed(1)} MB)`);
if (skipped.length) console.log("skipped:\n  " + skipped.join("\n  "));
if (warnings.length) console.log(`warnings (${warnings.length}):\n  ` + warnings.join("\n  "));
