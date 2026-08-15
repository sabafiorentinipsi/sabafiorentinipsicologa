/**
 * Genera le pagine HTML degli articoli a partire da data/posts.json.
 * Uso: node scripts/generate-articles.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data", "posts.json"), "utf8"));

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderContent(blocks) {
  return (blocks || [])
    .map((block) => {
      const t = String(block).trim();
      if (!t) return "";
      if (t.startsWith("## ")) return `<h2>${esc(t.slice(3))}</h2>`;
      return `<p>${esc(t)}</p>`;
    })
    .join("\n");
}

function renderSources(sources) {
  if (!sources || !sources.length) return "";
  return `<section class="article-sources">
          <h2>Riferimenti bibliografici</h2>
          <ol>
            ${sources.map((s) => `<li>${esc(s)}</li>`).join("\n            ")}
          </ol>
        </section>`;
}

for (const post of data.posts) {
  const url = `https://www.sabafiorentinipsicologa.it/${post.id}.html`;
  const keywords = (post.keywords || []).join(", ");
  const subtitle = post.subtitle
    ? `<p class="article-subtitle">${esc(post.subtitle)}</p>`
    : "";

  const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(post.title)} | Saba Fiorentini</title>
    <meta name="description" content="${esc(post.excerpt || "")}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="author" content="Saba Fiorentini" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(post.title)}" />
    <meta property="og:description" content="${esc(post.excerpt || "")}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="it_IT" />
    <meta property="og:site_name" content="Saba Fiorentini — Psicologa" />
    <link rel="icon" href="./assets/favicon.png?v=6" type="image/png" sizes="192x192" />
    <link rel="icon" href="./assets/favicon.svg?v=6" type="image/svg+xml" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#contenuto">Vai al contenuto</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="./index.html#top" aria-label="Home">
          <span class="brand__name">Saba Fiorentini</span>
          <span class="brand__role">Psicologa</span>
        </a>
        <nav class="nav" id="nav-menu" aria-label="Navigazione principale">
          <a href="./index.html#chi-sono">Chi sono</a>
          <a href="./index.html#cosa-offro">Cosa offro</a>
          <a href="./index.html#online">Online</a>
          <a href="./faq.html">FAQ</a>
          <a href="./index.html#approfondimenti">Approfondimenti</a>
        </nav>
        <div class="header-actions">
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Apri menu">
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
          </button>
          <a class="btn btn--primary header-cta" href="./index.html#prenota">Prenota</a>
        </div>
      </div>
    </header>
    <main id="contenuto" class="section legal-page">
      <article class="container legal-page__inner article-page">
        <p class="article-kicker"><a href="./index.html#approfondimenti">Approfondimenti</a></p>
        <h1>${esc(post.title)}</h1>
        ${subtitle}
        <div class="article-body">
${renderContent(post.content)}
        </div>
        ${renderSources(post.sources)}
        <p class="legal-page__back">
          <a class="btn btn--primary" href="./index.html#prenota">Prenota un colloquio</a>
          <a class="btn btn--ghost" href="./index.html#approfondimenti">Tutti gli approfondimenti</a>
        </p>
      </article>
    </main>
    <footer class="site-footer">
      <div class="container footer-bottom">
        <div class="footer-bottom__inner">
          <p class="footer-bottom__copy">
            <span>© <span id="year"></span> Saba Fiorentini — Psicologa</span>
            <a href="./privacy.html">Privacy Policy</a>
            <a href="./faq.html">FAQ</a>
          </p>
        </div>
      </div>
    </footer>
    <script src="./js/config.js" defer></script>
    <script src="./js/main.js" defer></script>
    <script type="application/ld+json">
      ${JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || "",
          datePublished: post.date || "2026-07-14",
          dateModified: "2026-08-15",
          inLanguage: "it-IT",
          author: {
            "@type": "Person",
            name: "Saba Fiorentini",
            url: "https://www.sabafiorentinipsicologa.it/",
          },
          publisher: {
            "@type": "Person",
            name: "Saba Fiorentini",
            url: "https://www.sabafiorentinipsicologa.it/",
          },
          mainEntityOfPage: url,
          keywords: (post.keywords || []).join(", "),
        },
        null,
        2
      )}
    </script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(root, `${post.id}.html`), html);
  console.log(`Wrote ${post.id}.html`);
}
