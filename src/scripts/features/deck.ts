import { all, clamp, one, rafThrottle } from "../core/dom";

// Matches the sticky offsets in _projects.scss.
const STICKY_GAP_PX = 16;
const STICKY_STEP_PX = 12;
const BOTTOM_MARGIN_PX = 12;

const desktopQuery = window.matchMedia("(min-width: 1024px)");

export function initDeck(): void {
  const deck = one(document, "[data-deck]", HTMLElement);
  const bar = one(document, ".site-header__bar", HTMLElement);

  if (!deck) {
    return;
  }

  const cards = all(deck, "[data-case]", HTMLElement);

  if (cards.length < 2) {
    return;
  }

  const update = (): void => {
    if (!deck.classList.contains("is-stacked")) {
      return;
    }

    const viewport = window.innerHeight;

    cards.forEach((card, index) => {
      const next = cards[index + 1];

      if (!next) {
        card.style.setProperty("--cover", "0");
        return;
      }

      const nextTop = next.getBoundingClientRect().top;
      const stickyTop = Number.parseFloat(getComputedStyle(next).top) || 0;
      const progress = clamp((viewport - nextTop) / Math.max(1, viewport - stickyTop), 0, 1);

      card.style.setProperty("--cover", progress.toFixed(3));
    });
  };

  // Stack only when every card fits below the header; otherwise the bottom of
  // a tall card would stay hidden under the next one.
  const layout = (): void => {
    const headerBottom = bar ? bar.getBoundingClientRect().bottom : 0;
    const available = window.innerHeight - headerBottom - STICKY_GAP_PX
      - (cards.length - 1) * STICKY_STEP_PX - BOTTOM_MARGIN_PX;
    const fits = desktopQuery.matches && cards.every((card) => card.offsetHeight <= available);

    deck.classList.toggle("is-stacked", fits);

    if (!fits) {
      for (const card of cards) {
        card.style.removeProperty("--cover");
      }
    }

    update();
  };

  layout();
  window.addEventListener("scroll", rafThrottle(update), { passive: true });
  window.addEventListener("resize", rafThrottle(layout));
  desktopQuery.addEventListener("change", layout);
  void document.fonts.ready.then(layout);
}
