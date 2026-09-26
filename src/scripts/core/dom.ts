type ElementType<T extends Element> = { new (): T; prototype: T };

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

export function prefersReducedMotion(): boolean {
  return reducedMotionQuery.matches;
}

export function one<T extends Element>(root: ParentNode, selector: string, type: ElementType<T>): T | null {
  const element = root.querySelector(selector);
  return element instanceof type ? element : null;
}

export function all<T extends Element>(root: ParentNode, selector: string, type: ElementType<T>): T[] {
  return Array.from(root.querySelectorAll(selector)).filter((element): element is T => element instanceof type);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function rafThrottle(callback: () => void): () => void {
  let queued = false;

  return () => {
    if (queued) {
      return;
    }

    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      callback();
    });
  };
}

export function onceVisible(element: Element, callback: () => void, threshold: number): void {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) {
      return;
    }

    observer.disconnect();
    callback();
  }, { threshold });

  observer.observe(element);
}
