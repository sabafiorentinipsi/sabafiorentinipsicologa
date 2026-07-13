# Saba Fiorentini — sito web (statico)

Sito one-page per **Saba Fiorentini, Psicologa** — hosting statico su GitHub Pages con dominio Tophost.

## Struttura progetto

```
├── index.html          # Pagina principale (one-page)
├── grazie.html         # Conferma invio form contatti
├── styles.css          # Stili globali
├── js/
│   ├── config.js       # Costanti e configurazione condivisa
│   └── main.js         # Logica UI (menu, dock mobile, footer)
├── assets/             # Immagini e icone SVG
├── robots.txt          # Indicizzazione motori di ricerca
├── sitemap.xml         # Mappa del sito
└── CNAME               # Dominio custom GitHub Pages
```

## Form contatti

La form in `#prenota` invia email tramite [FormSubmit](https://formsubmit.co) — non serve backend.

## Indicizzazione (SEO)

Dopo il deploy, verifica che il sito sia raggiungibile e indicizzabile:

1. **GitHub Pages attivo** — repo pubblico o Pages abilitato; branch `main` / root
2. **DNS Tophost** — record `CNAME` `www` → `sabafiorentinipsi.github.io`
3. **Google Search Console** — aggiungi la proprietà `https://www.sabafiorentinipsicologa.it/` e invia la sitemap
4. **Test URL** — controlla che rispondano:
   - `https://www.sabafiorentinipsicologa.it/`
   - `https://www.sabafiorentinipsicologa.it/robots.txt`
   - `https://www.sabafiorentinipsicologa.it/sitemap.xml`

File SEO inclusi: `robots.txt`, `sitemap.xml`, meta tag Open Graph/Twitter, JSON-LD Schema.org.

## Pubblicazione

1. Push su GitHub (branch `main`)
2. GitHub → **Settings → Pages** → deploy da branch `main` (root)
3. Imposta **Custom domain**: `www.sabafiorentinipsicologa.it`

## Sviluppo locale

Apri `index.html` con un server locale (es. Live Server) oppure:

```bash
python -m http.server 8080
```
