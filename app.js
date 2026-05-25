const loader = document.querySelector("[data-loader]");
document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 650);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = Number(entry.target.getAttribute("data-count"));
      const startedAt = performance.now();
      const duration = 1300;

      const tick = (time) => {
        const progress = Math.min((time - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased).toString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const filters = document.querySelectorAll("[data-filter]");
const galleryCards = document.querySelectorAll(".gallery-card");

filters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selected = filterButton.getAttribute("data-filter");

    filters.forEach((button) => button.classList.remove("is-active"));
    filterButton.classList.add("is-active");

    galleryCards.forEach((card) => {
      const categories = card.getAttribute("data-category") || "";
      const shouldShow = selected === "all" || categories.includes(selected);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const parallaxTarget = document.querySelector("[data-parallax]");

window.addEventListener(
  "scroll",
  () => {
    if (!parallaxTarget || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const offset = Math.min(window.scrollY * 0.08, 46);
    parallaxTarget.style.transform = `translate3d(0, ${offset}px, 0)`;
  },
  { passive: true }
);

const replayButton = document.querySelector("[data-replay]");
const filmImage = document.querySelector(".phone-frame img");

replayButton?.addEventListener("click", () => {
  if (!(filmImage instanceof HTMLImageElement)) return;
  const source = filmImage.getAttribute("src");
  if (!source) return;
  filmImage.setAttribute("src", "");
  requestAnimationFrame(() => {
    filmImage.setAttribute("src", `${source.split("?")[0]}?replay=${Date.now()}`);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
