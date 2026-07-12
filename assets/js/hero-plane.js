"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main#top");
  const header = document.querySelector(".site-header");
  const portrait = document.querySelector(".portrait-stage");
  const stats = document.querySelector(".stats");
  const statItems = Array.from(document.querySelectorAll(".stats .stat"));

  if (!(main instanceof HTMLElement) ||
      !(portrait instanceof HTMLElement) ||
      !(stats instanceof HTMLElement) ||
      statItems.length === 0) {
    return;
  }

  const updatePlaneGeometry = () => {
    const mainRect = main.getBoundingClientRect();
    const portraitRect = portrait.getBoundingClientRect();
    const statsRect = stats.getBoundingClientRect();
    const firstStatRect = statItems[0].getBoundingClientRect();
    const hasSecondRow = statItems.some((item) => {
      return item.getBoundingClientRect().top > firstStatRect.top + 1;
    });
    const bottomAnchor = hasSecondRow ? firstStatRect.bottom : statsRect.bottom;
    const mainDocumentTop = mainRect.top + window.scrollY;
    const bottomAnchorDocument = bottomAnchor + window.scrollY;
    const planeTop = -mainDocumentTop;
    const planeLeft = portraitRect.left - mainRect.left;
    const planeHeight = bottomAnchorDocument;

    main.style.setProperty("--hero-plane-top", `${planeTop.toFixed(2)}px`);
    main.style.setProperty("--hero-plane-left", `${planeLeft.toFixed(2)}px`);
    main.style.setProperty("--hero-plane-height", `${planeHeight.toFixed(2)}px`);

    if (header instanceof HTMLElement) {
      header.style.setProperty("--header-plane-left", `${portraitRect.left.toFixed(2)}px`);
      header.style.setProperty("--header-plane-height", `${planeHeight.toFixed(2)}px`);
    }
  };

  updatePlaneGeometry();

  const resizeObserver = new ResizeObserver(updatePlaneGeometry);
  resizeObserver.observe(portrait);
  resizeObserver.observe(stats);

  window.addEventListener("resize", updatePlaneGeometry, { passive: true });
  document.fonts.ready.then(updatePlaneGeometry);
});
