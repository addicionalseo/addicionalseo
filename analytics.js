(() => {
  const GA_MEASUREMENT_ID = "G-CJW2DP4FQB";
  const CONSENT_KEY = "addicionalseo_cookie_consent";
  const ANALYTICS_STORAGE_KEY = "analytics";
  const BANNER_ID = "cookie-consent";

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !GA_MEASUREMENT_ID
  ) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = window.gtag || gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false
  });

  let analyticsLoaded = false;
  let pageViewSent = false;

  function getLocale() {
    return document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "ca";
  }

  function getCopy() {
    return getLocale() === "es"
      ? {
          title: "Cookies de analitica",
          description:
            "Usamos herramientas de medicion para mejorar la experiencia del sitio. Puedes aceptar o rechazar este uso.",
          accept: "Aceptar",
          reject: "Rechazar"
        }
      : {
          title: "Cookies d'analitica",
          description:
            "Fem servir eines de mesura per millorar l'experiencia del lloc. Pots acceptar o rebutjar aquest us.",
          accept: "Acceptar",
          reject: "Rebutjar"
        };
  }

  function loadAnalyticsScript() {
    if (analyticsLoaded) {
      return;
    }

    analyticsLoaded = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  function sendPageView() {
    if (pageViewSent) {
      return;
    }

    pageViewSent = true;
    gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search
    });
  }

  function trackEvent(name, params) {
    gtag("event", name, params);
  }

  function getStoredConsent() {
    try {
      return JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setStoredConsent(analyticsEnabled) {
    const payload = {
      [ANALYTICS_STORAGE_KEY]: analyticsEnabled,
      updatedAt: new Date().toISOString()
    };

    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  }

  function applyConsent(analyticsEnabled) {
    gtag("consent", "update", {
      analytics_storage: analyticsEnabled ? "granted" : "denied"
    });

    if (analyticsEnabled) {
      loadAnalyticsScript();
      sendPageView();
    }
  }

  function removeBanner() {
    document.getElementById(BANNER_ID)?.remove();
  }

  function handleConsentChoice(analyticsEnabled) {
    setStoredConsent(analyticsEnabled);
    applyConsent(analyticsEnabled);
    removeBanner();
  }

  function showBanner() {
    if (document.getElementById(BANNER_ID)) {
      return;
    }

    const copy = getCopy();
    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-banner__panel" role="dialog" aria-live="polite" aria-label="${copy.title}">
        <p class="cookie-banner__title">${copy.title}</p>
        <p class="cookie-banner__text">${copy.description}</p>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__button cookie-banner__button--ghost" data-consent="reject">${copy.reject}</button>
          <button type="button" class="cookie-banner__button cookie-banner__button--primary" data-consent="accept">${copy.accept}</button>
        </div>
      </div>
    `;

    banner.querySelector('[data-consent="accept"]')?.addEventListener("click", () => {
      handleConsentChoice(true);
    });
    banner.querySelector('[data-consent="reject"]')?.addEventListener("click", () => {
      handleConsentChoice(false);
    });

    document.body.appendChild(banner);
  }

  function injectStyles() {
    if (document.getElementById("cookie-consent-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "cookie-consent-styles";
    style.textContent = `
      .cookie-banner {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .cookie-banner {
        position: fixed;
        inset: auto 16px 16px;
        z-index: 2000;
        display: flex;
        justify-content: center;
      }

      .cookie-banner__panel {
        width: min(100%, 460px);
        padding: 16px;
        border-radius: 8px;
        background: rgba(8, 8, 8, 0.94);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(14px);
      }

      .cookie-banner__title {
        margin: 0 0 8px;
        font-size: 1rem;
        font-weight: 700;
      }

      .cookie-banner__text {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.82);
      }

      .cookie-banner__text a {
        color: #ffffff;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .cookie-banner__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .cookie-banner__button {
        appearance: none;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 10px 16px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      .cookie-banner__button--primary {
        background: #ffffff;
        color: #080808;
      }

      .cookie-banner__button--ghost {
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
        border-color: rgba(255,255,255,0.12);
      }

      @media (max-width: 640px) {
        .cookie-banner {
          inset-inline: 12px;
          bottom: 12px;
        }

        .cookie-banner__actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .cookie-banner__button {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function bindInteractionTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) {
        return;
      }

      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("contact_click", {
          contact_type: "phone",
          link_url: href
        });
      } else if (href.startsWith("mailto:")) {
        trackEvent("contact_click", {
          contact_type: "email",
          link_url: href
        });
      }
    });

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", () => {
        trackEvent("generate_lead", {
          form_id: form.id || "form-without-id",
          form_name: form.getAttribute("name") || ""
        });
      });
    });
  }

  injectStyles();
  bindInteractionTracking();

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("[data-cookie-manage]") : null;
    if (!link) {
      return;
    }

    event.preventDefault();
    showBanner();
  });

  const storedConsent = getStoredConsent();
  if (storedConsent && typeof storedConsent[ANALYTICS_STORAGE_KEY] === "boolean") {
    applyConsent(storedConsent[ANALYTICS_STORAGE_KEY]);
  } else {
    showBanner();
  }
})();
