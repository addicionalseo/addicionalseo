// Fix: html { scroll-behavior: smooth } makes the browser's native
// jump-to-anchor-on-load get interrupted before finishing (likely fought
// by other scroll-linked effects running during initial load), leaving
// the page stuck near scrollY 0 even though the hash is present in the
// URL. Force an instant, explicit scroll to the target after everything
// (images, video, fonts) has settled, so it runs after -- and wins over --
// any interrupted native attempt.
if (location.hash) {
  const jumpToHash = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  };
  window.addEventListener("load", () => setTimeout(jumpToHash, 120));
}

// Header scroll effect
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = () => prefersReducedMotionQuery.matches;

// Split headings into word spans BEFORE the reveal observer fires
initWordReveal();

if (navToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.classList.contains("is-open")) return;
    if (siteNav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeNav();
    }
  });
}

const isRepeatingReveal = (element) =>
  !!(element.closest("#oficina") || element.closest(".service-trio"));

const revealElements = Array.from(document.querySelectorAll("[data-reveal]")).filter(
  (element) => !isRepeatingReveal(element)
);
const repeatingRevealElements = Array.from(document.querySelectorAll("[data-reveal]")).filter(
  isRepeatingReveal
);

if (revealElements.length) {
  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
  });

  if (prefersReducedMotion()) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    // Fallback: force-reveal elements already in viewport after 600ms.
    // Handles direct links, hash navigation and fast scroll that can bypass
    // the IntersectionObserver callback before the element leaves view.
    setTimeout(function () {
      revealElements.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
          el.classList.add("is-visible");
        }
      });
    }, 600);
  }
}

// #oficina i el trio disseny-web/SEO/Google Ads: efecte d'entrada que es
// repeteix cada vegada que la secció entra al viewport, tant baixant com
// pujant (a diferència del reveal general, que només s'activa un cop).
// Fet amb getBoundingClientRect() en un listener de scroll (no amb
// IntersectionObserver) perquè es recalculi de forma explícita i fiable
// en cada frame, sense dependre de la finestra d'intersecció d'un observer.
if (repeatingRevealElements.length) {
  if (prefersReducedMotion()) {
    repeatingRevealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    let repeatingRevealTicking = false;
    const updateRepeatingReveal = () => {
      const vh = window.innerHeight;
      repeatingRevealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < vh - 40 && rect.bottom > 0;
        element.classList.toggle("is-visible", isVisible);
      });
      repeatingRevealTicking = false;
    };

    updateRepeatingReveal();
    window.addEventListener(
      "scroll",
      () => {
        if (!repeatingRevealTicking) {
          repeatingRevealTicking = true;
          requestAnimationFrame(updateRepeatingReveal);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateRepeatingReveal);
  }
}

function initContactFormTypeToggle(form) {
  const select = form.querySelector(".f-type");
  const businessGroup = form.querySelector(".f-business-group");
  if (!select || !businessGroup) return;
  const businessInput = businessGroup.querySelector("input");
  const syncBusinessField = () => {
    const show = select.value === "autonom" || select.value === "empresa";
    businessGroup.hidden = !show;
    if (!show && businessInput) businessInput.value = "";
  };
  select.addEventListener("change", syncBusinessField);
  syncBusinessField();
}

function initContactFormSubmit(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const locale = document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "ca";
    const copyByLocale = {
      ca: {
        subjectWithName: "Consulta web de",
        defaultSubject: "Nova consulta des del web",
        typeLabels: { particular: "Particular", autonom: "Autònom", empresa: "Empresa" },
        labels: {
          name: "Nom i cognoms",
          type: "Tipus",
          business: "Projecte / Empresa",
          phone: "Telèfon",
          email: "Email",
          postal: "Codi postal"
        }
      },
      es: {
        subjectWithName: "Consulta web de",
        defaultSubject: "Nueva consulta desde la web",
        typeLabels: { particular: "Particular", autonom: "Autónomo", empresa: "Empresa" },
        labels: {
          name: "Nombre y apellidos",
          type: "Tipo",
          business: "Proyecto / Empresa",
          phone: "Teléfono",
          email: "Email",
          postal: "Código postal"
        }
      }
    };
    const copy = copyByLocale[locale];
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const type = (data.get("type") || "").toString().trim();
    const business = (data.get("business") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const postal = (data.get("postal") || "").toString().trim();

    const subject = encodeURIComponent(
      name ? `${copy.subjectWithName} ${name}` : copy.defaultSubject
    );

    const bodyLines = [
      `${copy.labels.name}: ${name || "-"}`,
      `${copy.labels.type}: ${copy.typeLabels[type] || "-"}`
    ];
    if (type === "autonom" || type === "empresa") {
      bodyLines.push(`${copy.labels.business}: ${business || "-"}`);
    }
    bodyLines.push(
      `${copy.labels.phone}: ${phone || "-"}`,
      `${copy.labels.email}: ${email || "-"}`,
      `${copy.labels.postal}: ${postal || "-"}`
    );

    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:info@addicionalseo.com?subject=${subject}&body=${body}`;

    const modal = form.closest(".contact-modal");
    if (modal) closeContactModal(modal);
  });
}

document.querySelectorAll(".js-contact-form").forEach((form) => {
  initContactFormTypeToggle(form);
  initContactFormSubmit(form);
});

let contactModalEl = null;

function closeContactModal(modal) {
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

function buildContactModal() {
  if (contactModalEl) return contactModalEl;

  const locale = document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "ca";
  const copy = locale === "es"
    ? {
        title: "Hablemos de tu proyecto",
        subtitle: "Respuesta en menos de 48 h. Sin compromiso.",
        close: "Cerrar",
        name: "Nombre y apellidos", namePh: "Tu nombre y apellidos",
        type: "Eres...", typeOpt: "Selecciona una opción",
        typeParticular: "Particular", typeAutonom: "Autónomo", typeEmpresa: "Empresa",
        business: "Nombre del proyecto o empresa", businessPh: "Nombre del proyecto o de la empresa",
        phone: "Teléfono", phonePh: "6XX XXX XXX",
        email: "Correo electrónico", emailPh: "tu@correo.com",
        postal: "Código postal", postalOptional: "(opcional)", postalPh: "08001",
        submit: "Enviar",
        privacy: "Al enviar el formulario aceptas nuestra",
        privacyHref: "/es/politica-privacidad/", privacyText: "política de privacidad"
      }
    : {
        title: "Parlem del teu projecte",
        subtitle: "Resposta en menys de 48 h. Sense compromís.",
        close: "Tancar",
        name: "Nom i cognoms", namePh: "El teu nom i cognoms",
        type: "Ets...", typeOpt: "Selecciona una opció",
        typeParticular: "Particular", typeAutonom: "Autònom", typeEmpresa: "Empresa",
        business: "Nom del projecte o empresa", businessPh: "Nom del projecte o de l'empresa",
        phone: "Telèfon", phonePh: "6XX XXX XXX",
        email: "Correu electrònic", emailPh: "el.teu@correu.com",
        postal: "Codi postal", postalOptional: "(opcional)", postalPh: "08001",
        submit: "Enviar",
        privacy: "Enviant el formulari acceptes la nostra",
        privacyHref: "/politica-privacitat/", privacyText: "política de privacitat"
      };

  const modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.innerHTML = `
    <div class="contact-modal-backdrop" data-modal-close></div>
    <div class="contact-modal-panel" role="dialog" aria-modal="true" aria-label="${copy.title}">
      <button type="button" class="contact-modal-close" data-modal-close aria-label="${copy.close}">&times;</button>
      <p class="eyebrow">${copy.title}</p>
      <p class="contact-modal-subtitle">${copy.subtitle}</p>
      <form class="js-contact-form" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label>${copy.name} *</label>
            <input type="text" name="name" autocomplete="name" required placeholder="${copy.namePh}">
          </div>
          <div class="form-group">
            <label>${copy.type} *</label>
            <select name="type" class="f-type" required>
              <option value="" disabled selected>${copy.typeOpt}</option>
              <option value="particular">${copy.typeParticular}</option>
              <option value="autonom">${copy.typeAutonom}</option>
              <option value="empresa">${copy.typeEmpresa}</option>
            </select>
          </div>
        </div>
        <div class="form-group f-business-group" hidden>
          <label>${copy.business}</label>
          <input type="text" name="business" autocomplete="organization" placeholder="${copy.businessPh}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>${copy.phone} *</label>
            <input type="tel" name="phone" autocomplete="tel" required placeholder="${copy.phonePh}">
          </div>
          <div class="form-group">
            <label>${copy.email} *</label>
            <input type="email" name="email" autocomplete="email" required placeholder="${copy.emailPh}">
          </div>
        </div>
        <div class="form-group">
          <label>${copy.postal} <span class="form-optional">${copy.postalOptional}</span></label>
          <input type="text" name="postal" autocomplete="postal-code" inputmode="numeric" placeholder="${copy.postalPh}">
        </div>
        <p class="form-note">${copy.privacy} <a href="${copy.privacyHref}">${copy.privacyText}</a>.</p>
        <button type="submit" class="button">${copy.submit}</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", () => closeContactModal(modal));
  });

  const form = modal.querySelector(".js-contact-form");
  initContactFormTypeToggle(form);
  initContactFormSubmit(form);

  contactModalEl = modal;
  return modal;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModalEl && contactModalEl.classList.contains("is-open")) {
    closeContactModal(contactModalEl);
  }
});

document.querySelectorAll(".js-open-contact-modal").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const modal = buildContactModal();
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    const firstField = modal.querySelector("input");
    if (firstField) window.setTimeout(() => firstField.focus(), 50);
  });
});

const yearNode = document.querySelector("#current-year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (document.body.classList.contains("page-home")) {
  initHomeMotion();
} else if (!prefersReducedMotion()) {
  initParallax(document.querySelectorAll("[data-parallax]"));
  initScrollZoom(document.querySelectorAll("[data-scroll-zoom]"));
}

function initHomeMotion() {
  const parallaxMedia = document.querySelectorAll("[data-parallax]");
  const zoomMedia = document.querySelectorAll("[data-scroll-zoom]");

  syncServiceCardBackgrounds();

  // Hero entrance sequence
  const heroLines = document.querySelectorAll(".hero-h1-line");
  const heroIntro = document.querySelector(".mainframe-hero .hero-intro");
  const heroTyped = document.querySelector(".mainframe-hero .hero-typed");
  const heroTrust = document.querySelector(".mainframe-hero .hero-trust");
  const heroPills = document.querySelector(".mainframe-pills");

  if (prefersReducedMotion()) {
    [heroIntro, ...heroLines, heroTyped, heroTrust, heroPills].forEach(el => el && el.classList.add("is-active", "is-visible"));
  } else {
    // Add .hero-anm first (hides elements via CSS), then schedule reveals
    [heroIntro, ...heroLines, heroTyped, heroTrust].forEach(el => el && el.classList.add("hero-anm"));
    const showEl = (el, delay) => { if (!el) return; setTimeout(() => el.classList.add("is-active"), delay); };
    showEl(heroIntro, 80);
    heroLines.forEach((line, i) => showEl(line, 260 + i * 160));
    showEl(heroTyped, 260 + heroLines.length * 160 + 80);
    showEl(heroTrust, 260 + heroLines.length * 160 + 260);
    setTimeout(() => heroPills && heroPills.classList.add("is-visible"), 1100);
  }

  initServicesCopyParallax();

  if (!prefersReducedMotion()) {
    initParallax(parallaxMedia);
    initScrollZoom(zoomMedia);
    initHeroVideoScrub();
    initHeroVisualInteractive();
  }
}

// Grafiques dels serveis (home): inclinacio 3D amb el ratoli + realçat
// individual de barres/punts en fer-hi hover, perque siguin "jugables"
// enlloc de nomes decoratives.
function initHeroVisualInteractive() {
  document.querySelectorAll(".hero-visual").forEach((card) => {
    const chart = card.querySelector(".hero-visual-chart");
    if (!chart) return;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      chart.style.transform = `perspective(700px) rotateX(${(-py * 12).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg) scale(1.03)`;
      card.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
      card.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
      chart.style.transform = "";
    });

    card.querySelectorAll(".hero-visual-bar, .hero-visual-point, .hero-visual-dot").forEach((el) => {
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "center";
    });
  });
}

function initScrollZoom(nodes) {
  if (!nodes.length) {
    return;
  }

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    nodes.forEach((node) => {
      const section = node.closest(".scene-section") || node.parentElement;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0), 1);
      const zoomBase = parseFloat(node.dataset.zoomBase || "1");
      const zoomAmount = parseFloat(node.dataset.zoomAmount || "0.18");
      const yAmount = parseFloat(node.dataset.yAmount || "42");
      const zoom = zoomBase + (progress * zoomAmount);
      const y = (progress - 0.5) * -yAmount;

      node.style.setProperty("--scene-zoom", zoom.toFixed(4));
      node.style.setProperty("--scene-scroll-y", `${y.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}

function initHeroVideoScrub() {
  const video = document.querySelector(".page-home .hero-video");

  if (!video) {
    return;
  }

  const sensitivity = 0.8;
  const ease = 0.12;
  let targetTime = 0;
  let prevX = null;

  video.pause();

  video.addEventListener("loadedmetadata", () => {
    video.pause();
    targetTime = video.currentTime;
  });

  const tick = () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      const diff = targetTime - video.currentTime;
      if (Math.abs(diff) > 0.005) {
        video.currentTime += diff * ease;
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.addEventListener("mousemove", (event) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      prevX = event.clientX;
      return;
    }

    if (prevX === null) {
      prevX = event.clientX;
      return;
    }

    const delta = event.clientX - prevX;
    prevX = event.clientX;
    const deltaTime = (delta / window.innerWidth) * sensitivity * video.duration;
    targetTime = Math.min(Math.max(targetTime + deltaTime, 0), video.duration);
  });

  window.addEventListener("mouseleave", () => {
    prevX = null;
  });
}

function syncServiceCardBackgrounds() {
  const grids = document.querySelectorAll(".page-home .services-editorial");

  if (!grids.length) {
    return;
  }

  let assetRequest = null;

  const loadAsset = (grid) => {
    const rawAsset = getComputedStyle(grid).getPropertyValue("--service-bg-image").trim();
    const match = rawAsset.match(/url\((['"]?)(.*?)\1\)/);
    const src = match?.[2];

    if (!src) {
      return Promise.resolve({ width: 1, height: 1 });
    }

    const resolvedSrc = new URL(src, window.location.href).href;

    if (assetRequest?.src === resolvedSrc) {
      return assetRequest.promise;
    }

    assetRequest = {
      src: resolvedSrc,
      promise: new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          resolve({
            width: image.naturalWidth || 1,
            height: image.naturalHeight || 1
          });
        };
        image.onerror = () => resolve({ width: 1, height: 1 });
        image.src = resolvedSrc;
      })
    };

    return assetRequest.promise;
  };

  const syncGrid = async (grid) => {
    const cards = [...grid.querySelectorAll(".service-stage")];

    if (!cards.length) {
      return;
    }

    const gridRect = grid.getBoundingClientRect();
    const gridWidth = Math.round(gridRect.width);
    const gridHeight = Math.round(gridRect.height);

    if (!gridWidth || !gridHeight) {
      return;
    }

    const { width: assetWidth, height: assetHeight } = await loadAsset(grid);
    const scale = Math.max(gridWidth / assetWidth, gridHeight / assetHeight);
    const mosaicWidth = Math.round(assetWidth * scale);
    const mosaicHeight = Math.round(assetHeight * scale);
    const originX = Math.round((gridWidth - mosaicWidth) / 2);
    const originY = Math.round((gridHeight - mosaicHeight) / 2);

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = Math.round(rect.left - gridRect.left);
      const y = Math.round(rect.top - gridRect.top);

      card.style.setProperty("--bg-width", `${mosaicWidth}px`);
      card.style.setProperty("--bg-height", `${mosaicHeight}px`);
      card.style.setProperty("--bg-pos-x", `${originX - x}px`);
      card.style.setProperty("--bg-pos-y", `${originY - y}px`);
    });
  };

  let frame = 0;

  const requestSync = () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }

    frame = window.requestAnimationFrame(() => {
      Promise.all([...grids].map(syncGrid)).finally(() => {
        frame = 0;
      });
    });
  };

  requestSync();
  window.addEventListener("load", requestSync);
  window.addEventListener("resize", requestSync);

  if (document.fonts?.ready) {
    document.fonts.ready.then(requestSync).catch(() => {});
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(requestSync);
    grids.forEach((grid) => {
      observer.observe(grid);
      grid.querySelectorAll(".service-stage").forEach((card) => observer.observe(card));
    });
  }
}

function initInteractiveSurface(surface) {
  let frameId = 0;

  const reset = () => {
    surface.classList.remove("is-interacting");
    surface.style.removeProperty("--tilt-x");
    surface.style.removeProperty("--tilt-y");
    surface.style.removeProperty("--pointer-x");
    surface.style.removeProperty("--pointer-y");
  };

  surface.addEventListener("pointerenter", (event) => {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    surface.classList.add("is-interacting");
  });

  surface.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    const rect = surface.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((rect.height / 2 - y) / rect.height) * 6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 7;

    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(() => {
      surface.style.setProperty("--pointer-x", `${x}px`);
      surface.style.setProperty("--pointer-y", `${y}px`);
      surface.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      surface.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    });
  });

  surface.addEventListener("pointerleave", () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    reset();
  });
}

function initMagneticButton(button) {
  let frameId = 0;

  const reset = () => {
    button.style.setProperty("--magnetic-x", "0px");
    button.style.setProperty("--magnetic-y", "0px");
  };

  button.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    const rect = button.getBoundingClientRect();
    const moveX = (((event.clientX - rect.left) / rect.width) - 0.5) * 10;
    const moveY = (((event.clientY - rect.top) / rect.height) - 0.5) * 8;

    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(() => {
      button.style.setProperty("--magnetic-x", `${moveX.toFixed(2)}px`);
      button.style.setProperty("--magnetic-y", `${moveY.toFixed(2)}px`);
    });
  });

  button.addEventListener("pointerleave", () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    reset();
  });
}

function initParallax(nodes) {
  if (!nodes.length) {
    return;
  }

  const speedByType = {
    hero: 24,
    signature: 18,
    case: 14,
    cover: 12
  };

  const activeNodes = new Set();
  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    activeNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const centerOffset = rect.top + (rect.height / 2) - (viewportHeight / 2);
      const speed = speedByType[node.dataset.parallax] || 14;
      const translate = (centerOffset / viewportHeight) * -speed;
      node.style.setProperty("--parallax-y", `${translate.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeNodes.add(entry.target);
        } else {
          activeNodes.delete(entry.target);
        }
      });

      requestTick();
    },
    {
      rootMargin: "220px 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  requestTick();
}

function initServicesCopyParallax() {
  // Handled entirely by the inline script in index.html
}

// ── BLOC 1: Word clip-reveal ──────────────────────────
function initWordReveal() {
  if (prefersReducedMotion()) return;

  // Covers home (.js-split-title) and all other pages (main h1, main h2 inside data-reveal)
  var titles = document.querySelectorAll(".js-split-title, main [data-reveal] h1, main [data-reveal] h2");
  if (!titles.length) return;

  titles.forEach(function (el) {
    var nodes = Array.from(el.childNodes);
    el.innerHTML = "";
    var idx = 0;

    nodes.forEach(function (node) {
      if (node.nodeType !== 3) {
        // preserve non-text nodes (e.g. <br>, <em>)
        el.appendChild(node.cloneNode(true));
        return;
      }

      node.textContent.split(/(\s+)/).forEach(function (chunk) {
        if (/^\s+$/.test(chunk) || chunk === "") {
          if (chunk) el.appendChild(document.createTextNode(chunk));
          return;
        }
        var wrap = document.createElement("span");
        wrap.className = "word-wrap";
        var inner = document.createElement("span");
        inner.className = "word";
        inner.style.setProperty("--word-idx", idx);
        inner.textContent = chunk;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        idx++;
      });
    });
  });
}

// BLOC 5 — Interactive surface on contact form card (any page)
var contactFormCard = document.querySelector(".contact-form-card");
if (contactFormCard && !prefersReducedMotion()) {
  initInteractiveSurface(contactFormCard);
}

// BLOC 6 — Projects marquee: arrossegable amb el ratolí, a més de l'auto-scroll
document.querySelectorAll(".marquee-overflow").forEach(function (overflowEl) {
  var track = overflowEl.querySelector(".marquee-track");
  if (!track) return;

  var speed = 40; // px/s d'auto-scroll
  var position = 0;
  var halfWidth = track.scrollWidth / 2;
  var dragging = false;
  var draggedPastThreshold = false;
  var startX = 0;
  var startPos = 0;
  var lastTime = null;

  track.style.animation = "none";
  track.style.cursor = "grab";
  track.style.touchAction = "pan-y";

  function applyTransform() {
    if (halfWidth > 0) {
      position = (((position % halfWidth) + halfWidth) % halfWidth) - halfWidth;
    }
    track.style.transform = "translateX(" + position + "px)";
  }

  function frame(t) {
    if (lastTime === null) lastTime = t;
    var dt = (t - lastTime) / 1000;
    lastTime = t;
    if (!dragging && !prefersReducedMotion()) {
      position -= speed * dt;
      applyTransform();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function onPointerDown(e) {
    dragging = true;
    draggedPastThreshold = false;
    startX = e.clientX;
    startPos = position;
    track.style.cursor = "grabbing";
    if (track.setPointerCapture) {
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }
  function onPointerMove(e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) draggedPastThreshold = true;
    position = startPos + dx;
    applyTransform();
  }
  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    lastTime = null;
    track.style.cursor = "grab";
  }

  track.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  // Evita que arrossegar activi el link de la targeta.
  track.addEventListener(
    "click",
    function (e) {
      if (draggedPastThreshold) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
});
