"use strict";

window.addEventListener("DOMContentLoaded", () => {
  if (typeof window.baguetteBox === "undefined") {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.baguetteBox.run(".project-visual", {
    animation: prefersReducedMotion ? false : "fadeIn",
    captions: false,
    noScrollbars: true,
    overlayBackgroundColor: "rgba(7, 8, 10, 0.96)"
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
});
