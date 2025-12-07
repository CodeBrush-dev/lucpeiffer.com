// Single-file SEO snippet (CONFIG + META_DATA + LD_DATA + runtime)

(function () {
  "use strict";


  const CONFIG = {
    baseUrlFallback: "https://www.lucpeiffer.com",
    googleSiteVerification: "fXQROPoatb3wiB1mZItoAtUYc0hQz3bB5rh2uN--CD0"
  };

  // === DATA (from your previous meta-tags.js) ===
  const META_DATA = {"meta_tags_list":[{"page_url":"https://www.lucpeiffer.com/","title_tag":"Bande dessinée & Sculptures Bruxelles | Luc Peiffer","meta_description":"Artiste Luc Peiffer - sculptures et bande dessinée à Bruxelles. Portfolio, expositions et création artistique en Belgique. L&A Peiffer Communication & design."},{"page_url":"https://www.lucpeiffer.com/bruxelles-se-ressource","title_tag":"Bruxelles se ressource - Nageurs en bronze | Luc Peiffer","meta_description":"Série de petits nageurs abandonnés aux fontaines de Bruxelles. Nageurs en bronze, mémoire urbaine et expositions par Luc Peiffer."},{"page_url":"https://www.lucpeiffer.com/splash","title_tag":"A Little Splash - Nageurs en bronze | Luc Peiffer","meta_description":"A Little Splash : ensemble de petites nageuses, création artistique et installation exposée à Bruxelles. Œuvres de Luc Peiffer."},{"page_url":"https://www.lucpeiffer.com/fontaine","title_tag":"Fontaine - Nageurs en bronze | Luc Peiffer","meta_description":"Fontaine : sculpture en bronze (175x55 cm) exposée à Bruxelles. Œuvre de Luc Peiffer mêlant arts plastiques et installation publique."},{"page_url":"https://www.lucpeiffer.com/bd","title_tag":"Un Amour Suspendu - Bande dessinée Bruxelles | Luc Peiffer","meta_description":"Un Amour Suspendu (2023) - bande dessinée de Luc Peiffer et Pilar Pujadas. Roman graphique publié en Belgique. Découvrez la BD et le portfolio."},{"page_url":"https://www.lucpeiffer.com/etudes","title_tag":"Portfolio Luc Peiffer - Etudes & Maquettes | Luc Peiffer","meta_description":"Etudes, maquettes et recherches de Luc Peiffer. Portfolio d'arts plastiques, projets en cours et créations artistiques en Belgique et Bruxelles."},{"page_url":"https://www.lucpeiffer.com/babies","title_tag":"Babies - Arts plastiques Bruxelles | Luc Peiffer","meta_description":"Babies : série colorée de sculptures explorant l'enfance et la consommation. Expositions à Bruxelles et œuvres de l'artiste Luc Peiffer."},{"page_url":"https://www.lucpeiffer.com/greco","title_tag":"Hommage au Greco - Sculptures Bruxelles | Luc Peiffer","meta_description":"Hommage au Greco : ensemble de 12 personnages inspirés d'El Greco. Sculptures et expositions à Bruxelles par l'artiste Luc Peiffer."},{"page_url":"https://www.lucpeiffer.com/globes","title_tag":"Alte Kopfstücke - Arts plastiques Bruxelles | Luc Peiffer","meta_description":"Alte Kopfstücke : têtes compressées représentant isolement et vieillesse. Sculptures exposées à Bruxelles par Luc Peiffer."}],"keywords":["bande dessinee bruxelles","sculptures bruxelles","artiste luc peiffer","l&a peiffer communication","expositions bruxelles","nageurs en bronze","arts plastiques bruxelles","un amour suspendu","creation artistique belgique","portfolio luc peiffer","henri pfr"]};

  // === DATA (from your previous LD.js) ===
  const LD_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Luc Peiffer",
  "url": "https://www.lucpeiffer.com/",
  "image": "https://static.wixstatic.com/media/35660e_dc6b9053e4c5406bb1fdbf4071ea9bbd.jpg",
  "description": "Né à Bruxelles en 1965, sculpteur et auteur de bande dessinée. Travaille comme dessinateur et sculpteur; plusieurs sculptures exposées en Belgique et aux Pays-Bas. Auteur de \"Un Amour Suspendu\" (2023) avec Pilar Pujadas.",
  "birthDate": "1965",
  "birthPlace": {
    "@type": "Place",
    "name": "Bruxelles"
  },
  "jobTitle": "Sculpteur; auteur de bande dessinée; designer",
  "affiliation": {
    "@type": "Organization",
    "name": "L&A Peiffer Communication & Design"
  },
  "works": [
    {
      "@type": "Book",
      "name": "Un Amour Suspendu",
      "author": [
        {
          "@type": "Person",
          "name": "Luc Peiffer"
        },
        {
          "@type": "Person",
          "name": "Pilar Pujadas"
        }
      ],
      "datePublished": "2023",
      "inLanguage": "fr",
      "url": "https://kenneseditions.com/product/un-amour-suspendu/"
    }
  ],
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.lucpeiffer.com/"
  },
  "sameAs": [
    "http://www.galerie-amsterdam.nl/",
    "http://lifeofl.com",
    "http://www.smelik-stokking.nl/",
    "http://www.steyls-art.com/",
    "https://kenneseditions.com/product/un-amour-suspendu/",
    "http://www.annmicheledeceuninck.com/",
    "http://www.henripfr.com"
  ]
};

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
    const m = String(pathname || "/").match(
      /^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)(.*)$/
    );
    if (!m) return pathname || "/";
    const rest = stripTrailingSlash(m[2] || "/");
    return rest || "/";
  }

  function currentPagePath() {
    const path = window.location.pathname || "/";
    return stripTrailingSlash(path || "/");
  }

  function currentKeyCandidates() {
    const path = currentPagePath();
    const origin = (window.location.origin || "").replace(/\/$/, "");
    const full = origin + path;

    if (path === "/") {
      return [full, "/"];
    }

    const noLang = removeLangPrefix(path);
    return [full, path, stripTrailingSlash(path), noLang, stripTrailingSlash(noLang)];
  }

  function buildIndex(metaJson) {
    const list = (metaJson && metaJson.meta_tags_list) || [];
    const index = {};
    for (const item of list) {
      const path = normalizePathFromUrl(item.page_url);
      let origin = "";
      try {
        origin = new URL(item.page_url).origin;
      } catch {
        origin = "";
      }
      const full = origin ? origin.replace(/\/$/, "") + path : "";

      const entry = {
        title: item.title_tag || "",
        description: item.meta_description || "",
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

  function normalizeKeywordsList(input, opts) {
    const { maxKeywords = 20 } = opts || {};
    if (input == null) return [];
    let items = Array.isArray(input)
      ? input.slice()
      : typeof input === "string"
      ? input.split(",")
      : [];
    const seen = new Set();
    return items
      .map(_stripQuotes)
      .filter((s) => s && s.length >= 2)
      .filter((s) => {
        const k = s.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, maxKeywords);
  }

  function normalizeKeywords(input, opts) {
    const { maxKeywords = 20, maxLength = 280 } = opts || {};
    const list = normalizeKeywordsList(input, { maxKeywords });
    const content = list.join(", ");
    return content.length > maxLength ? content.slice(0, maxLength) : content;
  }

  function applyAltFallbacks(keywordsPool) {
    if (!Array.isArray(keywordsPool) || keywordsPool.length === 0) return;
    try {
      const images = Array.from(document.querySelectorAll("img"));
      let i = 0;
      images.forEach((img) => {
        const curAlt = (img.getAttribute("alt") || "").trim().toLowerCase();
        const shouldReplace =
          !curAlt ||
          curAlt.endsWith(".jpg") ||
          curAlt.endsWith(".png") ||
          curAlt === "image" ||
          curAlt === "img";
        if (shouldReplace) {
          img.setAttribute("alt", keywordsPool[i % keywordsPool.length]);
          i++;
        }
      });
    } catch {
      /* ignore */
    }
  }

  function optimizeImages() {
    try {
      const images = Array.from(document.querySelectorAll("img"));
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              io.unobserve(img);
              // hook for tracking / lazy work if needed
            }
          });
        });
        images.forEach((img, index) => {
          if (index > 0) io.observe(img);
        });
      }
    } catch (err) {
      console.error("Image optimization error:", err);
    }
  }

  function upsertMeta(nameOrProperty, content, useProperty) {
    const selector = useProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (useProperty) el.setAttribute("property", nameOrProperty);
      else el.setAttribute("name", nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }

  function injectJsonLd(ldObject) {
    if (!ldObject) return;
    try {
      const existing = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]')
      );
      existing.forEach((el) => {
        el.parentNode.removeChild(el);
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(ldObject);
      document.head.appendChild(script);
    } catch (err) {
      console.error("Error injecting JSON-LD:", err);
    }
  }

  function applyJsonLd() {
    injectJsonLd(LD_DATA);
  }

  function applySeoFromJson() {
    try {
      const metaJson = META_DATA;
      const index = buildIndex(metaJson);

      const path = currentPagePath();
      const isHome = path === "/";

      const fallbackBase =
        (CONFIG && CONFIG.baseUrlFallback) ? CONFIG.baseUrlFallback : "";
      const baseUrl = (window.location.origin || fallbackBase).replace(/\/$/, "");
      const canonicalUrl = baseUrl + path;

      const keys = currentKeyCandidates();
      let entry = null;
      for (const k of keys) {
        if (index[k]) {
          entry = index[k];
          break;
        }
      }

      if (!entry) {
        return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
      }

      const title = clamp(entry.title, 60);
      const desc = clamp(entry.description, 185);

      document.title = title;

      const metaList = [
        { type: "name", key: "description", content: desc },
        { type: "property", key: "og:url", content: canonicalUrl },
        { type: "name", key: "resource-hints", content: "preload" },
        { type: "name", key: "format-detection", content: "telephone=yes" },
        { type: "name", key: "mobile-web-app-capable", content: "yes" },
        { type: "name", key: "apple-mobile-web-app-capable", content: "yes" },
      ];

      // opcjonalnie dodaj google-site-verification, jeśli jest w CONFIG
      if (CONFIG && CONFIG.googleSiteVerification) {
        metaList.push({
          type: "name",
          key: "google-site-verification",
          content: CONFIG.googleSiteVerification
        });
      }

      if (isHome && metaJson && metaJson.keywords) {
        const kwContent = normalizeKeywords(metaJson.keywords, {
          maxKeywords: 25,
          maxLength: 512,
        });
        if (kwContent) {
          metaList.push({ type: "name", key: "keywords", content: kwContent });
        }
      }

      metaList.forEach((m) => {
        upsertMeta(m.key, m.content, m.type === "property");
      });

      upsertLink("canonical", canonicalUrl);

      return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
    } catch (err) {
      console.error("Error meta settings:", err);
      return [];
    }
  }

  function initSnippetSEO() {
    const keywordsPool = applySeoFromJson();
    const path = currentPagePath();
    if (path === "/") {
      applyJsonLd();
    }
    optimizeImages();
    applyAltFallbacks(keywordsPool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSnippetSEO);
  } else {
    initSnippetSEO();
  }
})();
