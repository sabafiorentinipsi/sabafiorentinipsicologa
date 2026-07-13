/**
 * Punto di ingresso JavaScript del sito.
 * Inizializza footer, navigazione mobile e barra contatti fissa.
 */
(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;
  if (!CONFIG) return;

  /**
   * Imposta l'anno corrente nel copyright del footer.
   */
  function initFooterYear() {
    const yearElement = document.querySelector(CONFIG.selectors.year);
    if (!yearElement) return;

    yearElement.textContent = String(new Date().getFullYear());
  }

  /**
   * Gestisce apertura/chiusura del menu hamburger su mobile.
   */
  function initMobileNav() {
    const navToggle = document.querySelector(CONFIG.selectors.navToggle);
    const navMenu = document.querySelector(CONFIG.selectors.navMenu);

    if (!navToggle || !navMenu) return;

    const closeMenu = () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Apri menu");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Chiudi menu" : "Apri menu");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > CONFIG.mobileBreakpoint) {
        closeMenu();
      }
    });
  }

  /**
   * Mostra la barra WhatsApp/Email solo nella sezione Prenota su mobile.
   * Usa IntersectionObserver con debounce per evitare lampeggiamenti.
   */
  function initMobileDock() {
    const mobileDock = document.querySelector(CONFIG.selectors.mobileDock);
    const prenotaSection = document.querySelector(CONFIG.selectors.prenotaSection);
    const footerSection = document.querySelector(CONFIG.selectors.footer);

    if (!mobileDock || !prenotaSection || !footerSection) return;

    const mobileQuery = window.matchMedia(`(max-width: ${CONFIG.mobileBreakpoint}px)`);

    let prenotaVisible = false;
    let footerVisible = false;
    let dockShown = false;
    let updateTimer = null;
    let lockUntil = 0;

    const applyDock = (show) => {
      if (show === dockShown) return;

      dockShown = show;
      mobileDock.classList.toggle("is-visible", show);
      mobileDock.setAttribute("aria-hidden", String(!show));
    };

    const updateDock = () => {
      if (!mobileQuery.matches) {
        applyDock(false);
        return;
      }

      const now = Date.now();
      const shouldShow = prenotaVisible && !footerVisible;

      if (now < lockUntil) {
        updateTimer = window.setTimeout(updateDock, lockUntil - now + 20);
        return;
      }

      if (shouldShow !== dockShown) {
        lockUntil = now + CONFIG.timing.toggleLock;
      }

      applyDock(shouldShow);
    };

    const scheduleUpdate = () => {
      if (updateTimer) window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(updateDock, CONFIG.timing.debounce);
    };

    const prenotaObserver = new IntersectionObserver(
      ([entry]) => {
        prenotaVisible = entry.isIntersecting;
        scheduleUpdate();
      },
      { threshold: 0, rootMargin: CONFIG.observer.prenotaRootMargin }
    );

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry.isIntersecting;
        scheduleUpdate();
      },
      { threshold: 0, rootMargin: CONFIG.observer.footerRootMargin }
    );

    prenotaObserver.observe(prenotaSection);
    footerObserver.observe(footerSection);

    mobileQuery.addEventListener("change", updateDock);

    window.addEventListener("hashchange", () => {
      window.setTimeout(updateDock, CONFIG.timing.afterNavigation);
    });

    document.querySelectorAll(CONFIG.selectors.prenotaLinks).forEach((link) => {
      link.addEventListener("click", () => {
        window.setTimeout(() => {
          prenotaVisible = true;
          footerVisible = false;
          applyDock(true);
        }, CONFIG.timing.afterNavigation);
      });
    });

    updateDock();
  }

  /** Avvio moduli quando il DOM è pronto. */
  function bootstrap() {
    document.documentElement.classList.remove("no-js");
    initFooterYear();
    initMobileNav();
    initMobileDock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
