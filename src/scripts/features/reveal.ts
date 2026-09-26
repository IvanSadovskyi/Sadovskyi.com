import { all } from "../core/dom";

export function initReveal(): void {
  const elements = all(document, ".reveal", HTMLElement);

  // Disables the CSS failsafe that would otherwise show hidden content.
  document.documentElement.classList.add("reveal-armed");

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  for (const element of elements) {
    observer.observe(element);
  }
}
