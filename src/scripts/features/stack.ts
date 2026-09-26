import { all, one, onceVisible, prefersReducedMotion, wait } from "../core/dom";

const SETTLE_MS = 1700;
const SCAN_STEP_MS = 420;

export function initStack(): void {
  const stack = one(document, "[data-stack]", HTMLElement);

  if (!stack) {
    return;
  }

  const plates = all(stack, "[data-stack-plate]", HTMLElement);
  const items = all(stack, "[data-stack-item]", HTMLElement);
  let touched = false;

  const setActive = (layer: string | null): void => {
    for (const plate of plates) {
      plate.classList.toggle("is-active", plate.dataset.stackPlate === layer);
    }

    for (const item of items) {
      item.classList.toggle("is-active", item.dataset.stackItem === layer);
    }
  };

  for (const item of items) {
    item.addEventListener("pointerenter", () => {
      touched = true;
      setActive(item.dataset.stackItem ?? null);
    });
    item.addEventListener("pointerleave", () => {
      setActive(null);
    });
  }

  // One pass from the data model up to the portals after the stack opens.
  const scan = async (): Promise<void> => {
    for (const plate of plates) {
      if (touched) {
        return;
      }

      setActive(plate.dataset.stackPlate ?? null);
      await wait(SCAN_STEP_MS);
    }

    if (!touched) {
      setActive(null);
    }
  };

  onceVisible(stack, () => {
    stack.classList.add("is-open");

    if (prefersReducedMotion()) {
      stack.classList.add("is-settled");
      return;
    }

    void wait(SETTLE_MS).then(async () => {
      stack.classList.add("is-settled");
      await scan();
    });
  }, 0.4);
}
