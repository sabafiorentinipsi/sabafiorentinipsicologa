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

## Branch Git

| Branch | Uso |
|--------|-----|
| `develop` | Lavoro in corso (non ancora pubblicato) |
| `master` | Sito online (GitHub Pages + dominio) |

Flusso:
1. Lavori e fai push su `develop`
2. Quando è pronto: merge di `develop` in `master` e push di `master`
3. GitHub Pages pubblica da `master`

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

1. Merge `develop` → `master` e push di `master`
2. GitHub → **Settings → Pages** → deploy da branch **`master`** / root (`/`)
3. **Settings → General → Default branch** → imposta `master`
4. Custom domain: `www.sabafiorentinipsicologa.it`
5. DNS Tophost: `CNAME` `www` → `sabafiorentinipsi.github.io`

## Sviluppo locale

Serve un server HTTP (il file JSON non si carica aprendo direttamente `index.html`):

```bash
npx serve
```
