import { one, prefersReducedMotion } from "../core/dom";

const EASING = 0.08;
const SETTLE_EPSILON = 0.001;

// Gentle depth in the hero: the portrait drifts inside its arch and the trip
// card drifts the other way. Pointer devices only.
export function initParallax(): void {
  const hero = one(document, ".hero", HTMLElement);
  const portrait = hero ? one(hero, "[data-hero-portrait]", HTMLElement) : null;

  if (!hero || !portrait || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  let heroVisible = true;

  const render = (): void => {
    currentX += (targetX - currentX) * EASING;
    currentY += (targetY - currentY) * EASING;
    portrait.style.setProperty("--mx", currentX.toFixed(4));
    portrait.style.setProperty("--my", currentY.toFixed(4));

    const settled = Math.abs(targetX - currentX) < SETTLE_EPSILON && Math.abs(targetY - currentY) < SETTLE_EPSILON;
    frame = settled ? 0 : window.requestAnimationFrame(render);
  };

  const schedule = (): void => {
    if (frame === 0) {
      frame = window.requestAnimationFrame(render);
    }
  };

  window.addEventListener("pointermove", (event) => {
    if (!heroVisible) {
      return;
    }

    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = (event.clientY / window.innerHeight) * 2 - 1;
    schedule();
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    schedule();
  });

  new IntersectionObserver((entries) => {
    heroVisible = entries.some((entry) => entry.isIntersecting);
  }).observe(hero);
}
