// Minimal typing for the vendored baguetteBox global (assets/vendor/baguettebox).
interface BaguetteBoxOptions {
  animation?: "slideIn" | "fadeIn" | false;
  captions?: boolean;
  noScrollbars?: boolean;
  overlayBackgroundColor?: string;
}

interface BaguetteBoxStatic {
  run(selector: string, options?: BaguetteBoxOptions): unknown;
}

interface Window {
  baguetteBox?: BaguetteBoxStatic;
}
