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

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealElements = document.querySelectorAll("[data-reveal]");

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
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }
}

document.querySelectorAll(".js-contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const locale = document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "ca";
    const copyByLocale = {
      ca: {
        subjectWithName: "Consulta web de",
        defaultSubject: "Nova consulta des del web",
        labels: {
          name: "Nom",
          business: "Empresa",
          email: "Email",
          phone: "Telefon",
          service: "Servei",
          message: "Missatge"
        }
      },
      es: {
        subjectWithName: "Consulta web de",
        defaultSubject: "Nueva consulta desde la web",
        labels: {
          name: "Nombre",
          business: "Empresa",
          email: "Email",
          phone: "Telefono",
          service: "Servicio",
          message: "Mensaje"
        }
      }
    };
    const copy = copyByLocale[locale];
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const business = (data.get("business") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subject = encodeURIComponent(
      name ? `${copy.subjectWithName} ${name}` : copy.defaultSubject
    );

    const body = encodeURIComponent(
      [
        `${copy.labels.name}: ${name || "-"}`,
        `${copy.labels.business}: ${business || "-"}`,
        `${copy.labels.email}: ${email || "-"}`,
        `${copy.labels.phone}: ${phone || "-"}`,
        `${copy.labels.service}: ${service || "-"}`,
        "",
        `${copy.labels.message}:`,
        message || "-"
      ].join("\n")
    );

    window.location.href = `mailto:info@addicionalseo.com?subject=${subject}&body=${body}`;
  });
});

const yearNode = document.querySelector("#current-year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (document.body.classList.contains("page-home")) {
  initHomeMotion();
}

function initHomeMotion() {
  const parallaxMedia = document.querySelectorAll("[data-parallax]");
  const zoomMedia = document.querySelectorAll("[data-scroll-zoom]");

  syncServiceCardBackgrounds();

  if (!prefersReducedMotion()) {
    initParallax(parallaxMedia);
    initScrollZoom(zoomMedia);
    initHeroVideoScrub();
  }
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
  let prevX = null;
  let isSeeking = false;
  let pendingTime = null;
  let targetTime = 0;

  const seekTo = (nextTime) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const clamped = Math.min(Math.max(nextTime, 0), video.duration);
    targetTime = clamped;

    if (isSeeking) {
      pendingTime = clamped;
      return;
    }

    isSeeking = true;
    video.currentTime = clamped;
  };

  video.pause();

  video.addEventListener("loadedmetadata", () => {
    video.pause();
  });

  video.addEventListener("seeked", () => {
    if (pendingTime !== null && Math.abs(pendingTime - video.currentTime) > 0.01) {
      const queuedTime = pendingTime;
      pendingTime = null;
      video.currentTime = queuedTime;
      return;
    }

    pendingTime = null;
    isSeeking = false;

    if (Math.abs(targetTime - video.currentTime) > 0.01) {
      seekTo(targetTime);
    }
  });

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
    seekTo(video.currentTime + deltaTime);
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
