import { prefersReducedMotion } from "../core/dom";

// Screenshots open full screen and close only through the close button:
// backdrop clicks, swipes, and Escape are intentionally ignored.
export function initLightbox(): void {
  const baguetteBox = window.baguetteBox;

  if (!baguetteBox) {
    return;
  }

  baguetteBox.run(".case__visual", {
    animation: prefersReducedMotion() ? false : "fadeIn",
    captions: false,
    noScrollbars: true,
    overlayBackgroundColor: "rgba(10, 11, 13, 0.94)",
  });

  const overlay = document.getElementById("baguetteBox-overlay");

  if (!(overlay instanceof HTMLElement)) {
    return;
  }

  overlay.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof Element && target.closest(".baguetteBox-button")) {
      return;
    }

    event.stopImmediatePropagation();
  }, true);

  overlay.addEventListener("touchmove", (event) => {
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !overlay.classList.contains("visible")) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}
