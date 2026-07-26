# Saba Fiorentini — sito web (statico)

Sito one-page per **Saba Fiorentini, Psicologa** — hosting statico su GitHub Pages con dominio Tophost.

## Struttura progetto

```
├── index.html          # Pagina principale (one-page)
├── grazie.html         # Conferma invio form contatti
├── styles.css          # Stili globali
├── data/
│   └── posts.json      # Articoli (modifica solo questo file)
├── js/
│   ├── config.js       # Costanti e configurazione condivisa
│   └── main.js         # Logica UI (menu, dock, post)
├── assets/             # Immagini e icone
├── robots.txt
├── sitemap.xml
└── CNAME
```

## Articoli / approfondimenti

Niente database né area admin: per pubblicare o modificare un articolo edita solo `data/posts.json`.

```json
{
  "id": "nome-url",
  "title": "Titolo",
  "subtitle": "Sottotitolo opzionale",
  "date": "2026-07-14",
  "excerpt": "Anteprima nella card",
  "content": [
    "Paragrafo",
    "## Sottotitolo",
    "Altro paragrafo"
  ],
  "sources": ["Fonte bibliografica"]
}
```

Le stringhe in `content` che iniziano con `## ` diventano sottotitoli. Poi fai push su GitHub.

## Form contatti

La form in `#prenota` invia email tramite [FormSubmit](https://formsubmit.co).

## Pubblicazione

1. Push su GitHub (branch `main`)
2. GitHub → **Settings → Pages** → deploy da `main` / root
3. Custom domain: `www.sabafiorentinipsicologa.it`

## Sviluppo locale

Serve un server HTTP (il file JSON non si carica aprendo direttamente `index.html`):

```bash
npx serve
```
