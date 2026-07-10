import { readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const inputPages = {
  courses: "/tmp/mads-courses-single.html",
  professors: "/tmp/mads-professors-single.html",
  portal: "/tmp/mads-portal-single.html",
  student: "/tmp/mads-student-single.html",
  teacher: "/tmp/mads-teacher-single.html",
  admin: "/tmp/mads-admin-single.html",
};

const pages = Object.fromEntries(
  Object.entries(inputPages).map(([key, path]) => [
    key,
    gzipSync(readFileSync(path), { level: 9 }).toString("base64"),
  ]),
);

const outputPath =
  "/Users/gabrielpimenta/Downloads/Mads-Project-site-completo.html";
const homeHtml = readFileSync("/tmp/mads-home-single.html", "utf8");

const routerMarkup = `
<style>
  #mads-single-loader{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#0e0813;color:#f3eef7;font-family:Arial,sans-serif;transition:opacity .2s ease}
  #mads-single-loader[hidden]{display:none}
  #mads-single-loader .inner{text-align:center;padding:32px}
  #mads-single-loader .mark{width:44px;height:44px;margin:0 auto 20px;border:2px solid rgba(199,155,255,.24);border-top-color:#c79bff;border-radius:50%;animation:mads-single-spin .8s linear infinite}
  #mads-single-loader .title{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#d8b7ff}
  #mads-single-frame{position:fixed;inset:0;z-index:2147483646;width:100%;height:100%;border:0;background:#0e0813}
  @keyframes mads-single-spin{to{transform:rotate(360deg)}}
</style>
<div id="mads-single-loader" hidden>
  <div class="inner">
    <div class="mark"></div>
    <div class="title">Mads Project</div>
  </div>
</div>
<script>
(() => {
  const MADS_PAGES = ${JSON.stringify(pages)};
  const loader = document.getElementById("mads-single-loader");
  let frame = null;
  let currentPage = "home";
  let loadToken = 0;

  const routeMap = {
    "/": "home",
    "/cursos/": "courses",
    "/professores/": "professors",
    "/portal/": "portal",
    "/portal/aluno/": "student",
    "/portal/professor/": "teacher",
    "/portal/admin/": "admin"
  };

  async function decodePage(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const stream = new Blob([bytes])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    return new Response(stream).text();
  }

  function normalizePath(pathname) {
    if (pathname === "/") return pathname;
    return pathname.endsWith("/") ? pathname : pathname + "/";
  }

  function routeFromHref(href) {
    if (!href || href.startsWith("#")) return null;
    if (/^(mailto:|tel:|https:\/\/wa\.me|https:\/\/instagram\.com)/i.test(href)) {
      return null;
    }

    try {
      const url = new URL(href, "https://mads.local/");
      const key = routeMap[normalizePath(url.pathname)];
      return key ? { key, hash: url.hash } : null;
    } catch {
      return null;
    }
  }

  function scrollDocument(targetDocument, hash, behavior = "smooth") {
    const destination = hash
      ? targetDocument.getElementById(hash.slice(1))
      : targetDocument.documentElement;
    destination?.scrollIntoView({ behavior, block: "start" });
  }

  function handleNavigation(event, sourceDocument) {
    const target = event.target;
    const anchor =
      target && typeof target.closest === "function"
        ? target.closest("a")
        : null;
    if (!anchor) return;

    const route = routeFromHref(anchor.getAttribute("href"));
    if (!route) return;

    event.preventDefault();
    event.stopPropagation();

    if (route.key === currentPage) {
      scrollDocument(sourceDocument, route.hash);
      return;
    }

    showPage(route.key, route.hash);
  }

  function closeEmbeddedPage(hash) {
    if (frame) {
      frame.remove();
      frame = null;
    }
    currentPage = "home";
    loader.hidden = true;
    scrollDocument(document, hash);
  }

  async function showPage(key, hash = "") {
    if (key === "home") {
      closeEmbeddedPage(hash);
      return;
    }

    const token = ++loadToken;
    currentPage = key;
    loader.hidden = false;

    try {
      const html = await decodePage(MADS_PAGES[key]);
      if (token !== loadToken) return;

      if (!frame) {
        frame = document.createElement("iframe");
        frame.id = "mads-single-frame";
        frame.title = "Mads Project";
        document.body.appendChild(frame);
      }

      frame.onload = () => {
        const childDocument = frame.contentDocument;
        if (childDocument) {
          childDocument.addEventListener(
            "click",
            (event) => handleNavigation(event, childDocument),
            true,
          );
          if (hash) {
            requestAnimationFrame(() =>
              scrollDocument(childDocument, hash, "auto"),
            );
          }
        }
        loader.hidden = true;
      };
      frame.srcdoc = html;
    } catch (error) {
      loader.hidden = true;
      currentPage = "home";
      console.error("Falha ao abrir a pagina incorporada", error);
    }
  }

  document.addEventListener(
    "click",
    (event) => handleNavigation(event, document),
    true,
  );
})();
</script>`;

const bodyEnd = homeHtml.lastIndexOf("</body>");
if (bodyEnd === -1) throw new Error("Home page has no closing body tag");

const output =
  homeHtml.slice(0, bodyEnd) + routerMarkup + homeHtml.slice(bodyEnd);

writeFileSync(outputPath, output);
console.log(outputPath);
