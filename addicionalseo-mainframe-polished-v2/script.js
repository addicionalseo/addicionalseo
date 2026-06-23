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
  initHomeHero();
}

function initHomeMotion() {
  const parallaxMedia = document.querySelectorAll("[data-parallax]");

  if (!prefersReducedMotion()) {
    initParallax(parallaxMedia);
  }
}

function initHomeHero() {
  initTypewriter();
  initHeroActions();
  initHeroVideoScrub();
}

function initTypewriter() {
  const node = document.querySelector(".hero-typed[data-typewriter]");

  if (!node) {
    return;
  }

  const text = node.getAttribute("data-typewriter") || "";
  const speed = 38;
  const startDelay = 600;
  const cursor = document.createElement("span");
  cursor.className = "hero-type-cursor";
  let index = 0;

  window.setTimeout(() => {
    const intervalId = window.setInterval(() => {
      index += 1;
      node.textContent = text.slice(0, index);

      if (index >= text.length) {
        window.clearInterval(intervalId);
        cursor.remove();
        return;
      }

      node.appendChild(cursor);
    }, speed);

    node.appendChild(cursor);
  }, startDelay);
}

function initHeroActions() {
  const actions = document.querySelector(".hero-actions");

  if (!actions) {
    return;
  }

  window.setTimeout(() => {
    actions.classList.add("is-visible");
  }, 400);
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

// Mainframe hero email copy — static port from React behavior.
document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.getAttribute('data-copy-email') || 'hola@addicionalseo.com';
    const emailNode = button.querySelector('.mainframe-email');
    const previous = emailNode ? emailNode.textContent : '';
    try {
      await navigator.clipboard.writeText(email);
      if (emailNode) {
        emailNode.textContent = 'copiat';
        window.setTimeout(() => {
          emailNode.textContent = previous || email;
        }, 1600);
      }
    } catch (error) {
      if (emailNode) {
        emailNode.textContent = previous || email;
      }
    }
  });
});
