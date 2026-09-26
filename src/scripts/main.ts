// Entry point for assets/js/site.js.
import { initCopy } from "./features/copy";
import { initDeck } from "./features/deck";
import { initHeader } from "./features/header";
import { initLightbox } from "./features/lightbox";
import { initMenu } from "./features/menu";
import { initParallax } from "./features/parallax";
import { initReveal } from "./features/reveal";
import { initSplitFlap } from "./features/split-flap";
import { initStack } from "./features/stack";

function init(): void {
  initReveal();
  initHeader();
  initMenu();
  initParallax();
  initSplitFlap();
  initStack();
  initDeck();
  initLightbox();
  initCopy();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
