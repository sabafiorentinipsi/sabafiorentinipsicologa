/**
 * Configurazione centralizzata del sito.
 * Esposta su window per compatibilità con script classici (no ES modules).
 */
window.SITE_CONFIG = {
  /** Larghezza massima (px) per layout mobile/tablet. */
  mobileBreakpoint: 920,

  /** Selettori DOM usati da più moduli. */
  selectors: {
    year: "#year",
    navToggle: ".nav-toggle",
    navMenu: "#nav-menu",
    mobileDock: ".mobile-dock",
    prenotaSection: "#prenota",
    footer: ".site-footer",
    prenotaLinks: 'a[href="#prenota"]',
    postsList: "#posts-list",
    cookieBanner: "#cookie-banner",
    cookiePanel: "#cookie-panel",
    cookiePreferences: "#cookie-preferences",
    contactForm: "#contact-form",
    formStatus: "#form-status",
  },

  /** Percorso del file JSON dei post (modificabile senza DB). */
  postsUrl: "./data/posts.json",

  /** Endpoint AJAX FormSubmit e pagina di conferma. */
  formSubmitAjaxUrl: "https://formsubmit.co/ajax/sabafiorentini.psi@gmail.com",
  thankYouUrl: "./grazie.html",

  /** Chiave localStorage per le preferenze cookie. */
  cookieStorageKey: "sf_cookie_prefs_v1",

  /** Ritardi (ms) per sincronizzare UI dopo scroll o cambio hash. */
  timing: {
    debounce: 200,
    toggleLock: 350,
    afterNavigation: 450,
  },

  /** Margini IntersectionObserver per header e dock mobile. */
  observer: {
    prenotaRootMargin: "-72px 0px -76px 0px",
    footerRootMargin: "0px 0px -55% 0px",
  },
};
