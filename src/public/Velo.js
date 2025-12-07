// public/Velo.js

import wixLocationFrontend from "wix-location-frontend";
import { setTitle, setMetaTags } from "wix-seo-frontend";
import wixSeoFrontend from "wix-seo-frontend";
import { META_DATA } from "public/meta-tags.js";
import { LD_DATA }   from "public/LD.js";

/* ===== Helpers ===== */
function clamp(str, max) {
  if (typeof str !== "string") str = String(str ?? "");
  return str.length <= max ? str : str.slice(0, Math.max(0, max - 1)) + "…";
}
function stripTrailingSlash(p) {
  if (!p) return "/";
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}
function normalizePathFromUrl(url) {
  try {
    const u = new URL(url);
    return stripTrailingSlash(u.pathname || "/");
  } catch {
    const m = String(url || "").match(/^https?:\/\/[^/]+(\/[^?#]*)?/i);
    return stripTrailingSlash((m && m[1]) || "/");
  }
}

function removeLangPrefix(pathname) {
  const m = String(pathname || "/").match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)(.*)$/);
  if (!m) return pathname || "/";
  const rest = stripTrailingSlash(m[2] || "/");
  return rest || "/";
}

function currentPagePath() {
  const segments = wixLocationFrontend.path || [];
  const path = "/" + segments.join("/");
  return stripTrailingSlash(path || "/");
}

function currentKeyCandidates() {
  const path = currentPagePath(); 
  const origin = (wixLocationFrontend.baseUrl || "").replace(/\/$/, "");
  const full = origin + path;

  if (path === "/") {
    return [ full, "/" ];
  }

  const noLang = removeLangPrefix(path);
  return [ full, path, stripTrailingSlash(path), noLang, stripTrailingSlash(noLang) ];
}

function buildIndex(metaJson) {
  const list = (metaJson && metaJson.meta_tags_list) || [];
  const index = {};
  for (const item of list) {
    const path = normalizePathFromUrl(item.page_url);
    const origin = (() => { try { return new URL(item.page_url).origin; } catch { return ""; } })();
    const full = origin ? origin.replace(/\/$/, "") + path : "";

    const entry = {
      title: item.title_tag || "",
      description: item.meta_description || ""
    };

    index[path] = entry;
    index[stripTrailingSlash(path)] = entry;
    if (full) index[full] = entry;
  }
  return index;
}
function _stripQuotes(s) {
  return String(s ?? "")
    .replace(/["'“”‘’„«»]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–—·,;:]+|[\s\-–—·,;:]+$/g, "")
    .trim();
}
function normalizeKeywordsList(input, { maxKeywords = 20 } = {}) {
  if (input == null) return [];
  let items = Array.isArray(input) ? input.slice() : (typeof input === "string" ? input.split(",") : []);
  const seen = new Set();
  return items
    .map(_stripQuotes)
    .filter((s) => s && s.length >= 2)
    .filter((s) => { const k = s.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, maxKeywords);
}
function normalizeKeywords(input, { maxKeywords = 20, maxLength = 280 } = {}) {
  const list = normalizeKeywordsList(input, { maxKeywords });
  const content = list.join(", ");
  return content.length > maxLength ? content.slice(0, maxLength) : content;
}
function applyAltFallbacks(keywordsPool) {
  if (!Array.isArray(keywordsPool) || keywordsPool.length === 0) return;
  try {
    const images = $w("Image");
    let i = 0;
    images.forEach((img) => {
      const curAlt = (img.alt || "").trim().toLowerCase();
      const shouldReplace = !curAlt || curAlt.endsWith(".jpg") || curAlt.endsWith(".png") || curAlt === "image" || curAlt === "img";
      if (shouldReplace) { img.alt = keywordsPool[i % keywordsPool.length]; i++; }
    });
  } catch { /* ignore */ }
}

function optimizeImages() {
  try {
    const images = $w("Image");
    
    images.forEach((img, index) => {

      if (index > 0) { // only first image in...
        img.onViewportEnter(() => {
          console.log("Image lazy loaded:", img.alt || `Image ${index}`);
        });
      }
    });
    
  } catch (err) {
    console.error("Image optimization error:", err);
  }
}

/* ====== SCHEMA-LD ====== */
async function applyJsonLd() {
  try {
    await wixSeoFrontend.setStructuredData([ LD_DATA ]);
  } catch (err) {
    console.error("Error JSON-LD:", err);
  }
}

/* ===== META ===== */
async function applySeoFromJson() {
  try {
    const metaJson = META_DATA;
    const index = buildIndex(metaJson);

    const path = currentPagePath();
    const isHome = (path === "/");

    const baseUrl = wixLocationFrontend.baseUrl || "https://example.com";
    const canonicalUrl = baseUrl + path;

    const keys = currentKeyCandidates();
    let entry = null;
    for (const k of keys) { if (index[k]) { entry = index[k]; break; } }

    if (!entry) {
      return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
    }

    const title = clamp(entry.title, 60);
    const desc  = clamp(entry.description, 185);
    setTitle(title);

    const meta = [
      { name: "description", content: desc },
      { name: "google-site-verification", content: "fXQROPoatb3wiB1mZItoAtUYc0hQz3bB5rh2uN--CD0" },
      { property: "og:url", content: canonicalUrl },
      { name: "resource-hints", content: "preload" },
      { name: "format-detection", content: "telephone=yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ];

    if (isHome && metaJson && metaJson.keywords) {
      const kwContent = normalizeKeywords(metaJson.keywords, { maxKeywords: 25, maxLength: 512 });
      if (kwContent) meta.push({ name: "keywords", content: kwContent });
    }

    setMetaTags(meta);
    wixSeoFrontend.setLinks([
      {
        rel: "canonical",
        href: canonicalUrl,
      },
    ]);

    return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });

  } catch (err) {
    console.error("Error meta settings:", err);
    return [];
  }
}

/* ===== Public API ===== */
export async function initVeloSEO() {
  const keywordsPool = await applySeoFromJson();
  const path = currentPagePath();
  if (path === "/") { await applyJsonLd(); }
  optimizeImages();
  applyAltFallbacks(keywordsPool);
}