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

  /**
   * Formatta una data ISO in italiano (es. 14 luglio 2026).
   * Mantenuta per eventuali usi futuri nei contenuti.
   */
  function formatDate(isoDate) {
    if (!isoDate) return "";
    const date = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /**
   * Gestisce il banner cookie e salva le preferenze in localStorage.
   */
  function initCookieBanner() {
    const banner = document.querySelector(CONFIG.selectors.cookieBanner);
    const panel = document.querySelector(CONFIG.selectors.cookiePanel);
    const preferencesInput = document.querySelector(CONFIG.selectors.cookiePreferences);
    if (!banner) return;

    const storageKey = CONFIG.cookieStorageKey;

    const readPrefs = () => {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "null");
      } catch (error) {
        return null;
      }
    };

    const savePrefs = (prefs) => {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
      banner.hidden = true;
      document.body.classList.remove("cookie-open");
    };

    const existing = readPrefs();
    if (existing && existing.necessary) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    document.body.classList.add("cookie-open");

    banner.addEventListener("click", (event) => {
      const action = event.target.closest("[data-cookie-action]");
      if (!action) return;

      const type = action.getAttribute("data-cookie-action");

      if (type === "customize" && panel) {
        panel.hidden = !panel.hidden;
        return;
      }

      if (type === "necessary") {
        savePrefs({ necessary: true, preferences: false, updatedAt: new Date().toISOString() });
        return;
      }

      if (type === "accept") {
        savePrefs({ necessary: true, preferences: true, updatedAt: new Date().toISOString() });
        return;
      }

      if (type === "save") {
        savePrefs({
          necessary: true,
          preferences: Boolean(preferencesInput && preferencesInput.checked),
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  /**
   * Escape HTML per evitare injection quando si renderizzano i post dal JSON.
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Carica l'elenco post da data/posts.json e linka alle pagine HTML dedicate.
   * Redirect compatibilità: #post/id → id.html
   */
  function initPosts() {
    const listElement = document.querySelector(CONFIG.selectors.postsList);
    if (!listElement) return;

    const hashMatch = window.location.hash.match(/^#post\/(.+)$/);
    if (hashMatch) {
      window.location.replace(`./${encodeURIComponent(decodeURIComponent(hashMatch[1]))}.html`);
      return;
    }

    fetch(CONFIG.postsUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Impossibile caricare i post");
        return response.json();
      })
      .then((data) => {
        const posts = Array.isArray(data.posts) ? data.posts : [];
        if (!posts.length) {
          listElement.innerHTML =
            '<p class="posts-empty">Presto verranno pubblicati nuovi approfondimenti.</p>';
          return;
        }

        listElement.innerHTML = posts
          .map(
            (post) => `
          <article class="post-card">
            <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
            <p class="post-card__excerpt">${escapeHtml(post.excerpt || "")}</p>
            <a class="btn btn--ghost post-card__btn" href="./${escapeHtml(post.id)}.html">
              Leggi l'articolo
            </a>
          </article>
        `
          )
          .join("");
      })
      .catch(() => {
        listElement.innerHTML =
          '<p class="posts-empty">I contenuti non sono al momento disponibili.</p>';
      });
  }

  /**
   * Invia la form contatti via AJAX a FormSubmit e reindirizza a grazie.html.
   * Evita errori di redirect HTTPS/DNS lato FormSubmit.
   */
  function initContactForm() {
    const form = document.querySelector(CONFIG.selectors.contactForm);
    const status = document.querySelector(CONFIG.selectors.formStatus);
    if (!form) return;

    const submitButton = form.querySelector('[type="submit"]');
    const label = form.querySelector("[data-submit-label]");

    const setStatus = (message, isError) => {
      if (!status) return;
      status.hidden = !message;
      status.textContent = message || "";
      status.classList.toggle("form-status--error", Boolean(isError));
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("");

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      formData.delete("_next");

      if (submitButton) submitButton.disabled = true;
      if (label) label.textContent = "Invio in corso…";

      try {
        const response = await fetch(CONFIG.formSubmitAjaxUrl, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Invio non riuscito");
        }

        window.location.assign(CONFIG.thankYouUrl);
      } catch (error) {
        setStatus(
          "Non è stato possibile inviare la richiesta. Riprova tra poco oppure scrivimi via email.",
          true
        );
        if (submitButton) submitButton.disabled = false;
        if (label) label.textContent = "Invia richiesta";
      }
    });
  }

  /** Avvio moduli quando il DOM è pronto. */
  function bootstrap() {
    document.documentElement.classList.remove("no-js");
    initFooterYear();
    initMobileNav();
    initMobileDock();
    initPosts();
    initCookieBanner();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
