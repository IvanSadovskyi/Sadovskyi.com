import { all, one, onceVisible, prefersReducedMotion, wait } from "../core/dom";

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
const HALF_FLIP_MS = 62;

interface Tile {
  element: HTMLSpanElement;
  top: HTMLSpanElement;
  bottom: HTMLSpanElement;
  char: string;
}

interface FlapGroup {
  value: string;
  tiles: Tile[];
}

function createHalf(position: "top" | "bottom", char: string): HTMLSpanElement {
  const half = document.createElement("span");
  const glyph = document.createElement("span");

  half.className = `flap__half flap__half--${position}`;
  glyph.textContent = char;
  half.append(glyph);

  return half;
}

function setGlyph(half: HTMLSpanElement, char: string): void {
  const glyph = half.firstElementChild;

  if (glyph) {
    glyph.textContent = char;
  }
}

function createTile(char: string): Tile {
  const element = document.createElement("span");
  const top = createHalf("top", char);
  const bottom = createHalf("bottom", char);

  element.className = "flap__tile";
  element.setAttribute("aria-hidden", "true");
  element.append(top, bottom);

  return { element, top, bottom, char };
}

// One mechanical flip: the upper leaf falls, then the lower leaf lands.
async function flip(tile: Tile, next: string): Promise<void> {
  const upperLeaf = createHalf("top", tile.char);
  const lowerLeaf = createHalf("bottom", next);

  upperLeaf.classList.add("flap__leaf");
  lowerLeaf.classList.add("flap__leaf");
  lowerLeaf.style.transform = "rotateX(90deg)";

  setGlyph(tile.top, next);
  tile.element.append(upperLeaf, lowerLeaf);

  await upperLeaf.animate(
    [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
    { duration: HALF_FLIP_MS, easing: "ease-in", fill: "forwards" },
  ).finished;
  upperLeaf.remove();

  await lowerLeaf.animate(
    [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
    { duration: HALF_FLIP_MS, easing: "ease-out", fill: "forwards" },
  ).finished;

  setGlyph(tile.bottom, next);
  lowerLeaf.remove();
  tile.char = next;
}

// Real boards cycle through their drum in order, so approach the target from
// a few characters before it.
function sequenceTo(target: string): string[] {
  const targetIndex = Math.max(0, CHARSET.indexOf(target));
  const steps = 5 + Math.floor(Math.random() * 7);
  const sequence: string[] = [];

  for (let offset = steps; offset > 0; offset -= 1) {
    sequence.push(CHARSET.charAt((targetIndex - offset + CHARSET.length) % CHARSET.length));
  }

  sequence.push(target);
  return sequence;
}

async function spin(tile: Tile, target: string, delay: number): Promise<void> {
  await wait(delay);

  for (const char of sequenceTo(target)) {
    if (char !== tile.char) {
      await flip(tile, char);
    }
  }
}

function build(flap: HTMLElement, animate: boolean): FlapGroup {
  const label = (flap.textContent ?? "").trim();
  const value = flap.dataset.flap ?? label;
  const tiles = Array.from(value, (char) => createTile(animate ? " " : char));
  const spoken = document.createElement("span");

  spoken.className = "sr-only";
  spoken.textContent = label;
  flap.replaceChildren(spoken, ...tiles.map((tile) => tile.element));

  return { value, tiles };
}

export function initSplitFlap(): void {
  const board = one(document, "[data-board]", HTMLElement);

  if (!board) {
    return;
  }

  const animate = !prefersReducedMotion();
  const groups = all(board, "[data-flap]", HTMLElement).map((flap) => build(flap, animate));

  if (!animate) {
    return;
  }

  onceVisible(board, () => {
    groups.forEach((group, groupIndex) => {
      group.tiles.forEach((tile, tileIndex) => {
        void spin(tile, group.value.charAt(tileIndex), 180 + groupIndex * 150 + tileIndex * 90);
      });
    });
  }, 0.35);
}
