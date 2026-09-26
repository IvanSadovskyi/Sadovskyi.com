import { all, one } from "../core/dom";

export function initMenu(): void {
  const dialog = one(document, "[data-menu]", HTMLDialogElement);
  const openButton = one(document, "[data-menu-open]", HTMLButtonElement);

  if (!dialog || !openButton) {
    return;
  }

  const root = document.documentElement;

  const close = (): void => {
    root.classList.remove("menu-open");

    if (dialog.open) {
      dialog.close();
    }
  };

  openButton.setAttribute("aria-expanded", "false");
  openButton.addEventListener("click", () => {
    dialog.showModal();
    root.classList.add("menu-open");
    openButton.setAttribute("aria-expanded", "true");
  });

  dialog.addEventListener("close", () => {
    root.classList.remove("menu-open");
    openButton.setAttribute("aria-expanded", "false");
  });

  for (const control of all(dialog, "[data-menu-close], [data-menu-link]", HTMLElement)) {
    control.addEventListener("click", close);
  }

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) {
      close();
    }
  });
}
