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
  },

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
