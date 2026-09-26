import { all, one, rafThrottle } from "../core/dom";

export function initHeader(): void {
  const header = one(document, "[data-header]", HTMLElement);
  const bar = header ? one(header, ".site-header__bar", HTMLElement) : null;

  if (!header || !bar) {
    return;
  }

  const updateScrolled = (): void => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateScrolled();
  window.addEventListener("scroll", rafThrottle(updateScrolled), { passive: true });

  watchTone(header, bar);
  watchCurrentSection(header);
}

// Switches the header to its dark variant while it floats over an ink panel.
function watchTone(header: HTMLElement, bar: HTMLElement): void {
  const surfaces = all(document, "[data-tone=\"ink\"]", HTMLElement);
  const underneath = new Set<Element>();
  let observer: IntersectionObserver | null = null;
  let resizeTimer = 0;

  const observe = (): void => {
    observer?.disconnect();
    underneath.clear();

    const rect = bar.getBoundingClientRect();
    const line = Math.round(rect.top + rect.height / 2);
    const below = Math.max(0, window.innerHeight - line - 1);

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          underneath.add(entry.target);
        } else {
          underneath.delete(entry.target);
        }
      }

      header.dataset.tone = underneath.size > 0 ? "ink" : "paper";
    }, { rootMargin: `-${line}px 0px -${below}px 0px` });

    for (const surface of surfaces) {
      observer.observe(surface);
    }
  };

  observe();
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(observe, 150);
  });
}

function watchCurrentSection(header: HTMLElement): void {
  const links = all(header, "[data-nav-link]", HTMLAnchorElement);
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((section): section is HTMLElement => section !== null);
  const visible = new Map<Element, boolean>();

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visible.set(entry.target, entry.isIntersecting);
    }

    const current = sections.filter((section) => visible.get(section)).at(-1);

    for (const link of links) {
      if (current && link.hash === `#${current.id}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-45% 0px -50% 0px" });

  for (const section of sections) {
    observer.observe(section);
  }
}
