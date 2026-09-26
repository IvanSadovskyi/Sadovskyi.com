import { all } from "../core/dom";

const RESET_MS = 2200;

export function initCopy(): void {
  for (const button of all(document, "[data-copy]", HTMLButtonElement)) {
    const label = button.querySelector("[data-copy-label]");
    const idleText = label?.textContent ?? "";
    let resetTimer = 0;

    button.addEventListener("click", async () => {
      const value = button.dataset.copy ?? "";

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }

      button.classList.add("is-copied");

      if (label) {
        label.textContent = "Copied";
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.classList.remove("is-copied");

        if (label) {
          label.textContent = idleText;
        }
      }, RESET_MS);
    });
  }
}
