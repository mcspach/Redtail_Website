const TRANSITION_CLASS = "is-transitioning";
const INITIAL_LOADING_CLASS = "is-initial-loading";
const INITIAL_LOADING_EXIT_CLASS = "is-initial-loading-exit";
const INTRO_BOOT_CLASS = "rt-intro-boot";
const SESSION_KEY_HAS_SEEN_INTRO = "redtail:hasSeenIntro";

const FALLBACK_TIMINGS = {
  transitionDuration: 750,
  introMinHold: 550,
  introMaxWait: 2200,
  introFadeDuration: 280,
};

let navigationInProgress = false;

const delay = ms =>
  new Promise(resolve => window.setTimeout(resolve, Math.max(0, ms)));

const parseCssTimeToMs = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }

  const asNumber = Number.parseFloat(normalized);
  if (Number.isNaN(asNumber)) {
    return fallback;
  }

  if (normalized.endsWith("ms")) {
    return asNumber;
  }

  if (normalized.endsWith("s")) {
    return asNumber * 1000;
  }

  return asNumber;
};

const getTimingMs = (cssVariable, fallback) => {
  const styles = window.getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue(cssVariable);
  return parseCssTimeToMs(raw, fallback);
};

const getTimings = () => ({
  transitionDuration: getTimingMs(
    "--page-transition-duration",
    FALLBACK_TIMINGS.transitionDuration,
  ),
  introMinHold: getTimingMs(
    "--page-intro-min-hold",
    FALLBACK_TIMINGS.introMinHold,
  ),
  introMaxWait: getTimingMs(
    "--page-intro-max-wait",
    FALLBACK_TIMINGS.introMaxWait,
  ),
  introFadeDuration: getTimingMs(
    "--page-intro-fade-duration",
    FALLBACK_TIMINGS.introFadeDuration,
  ),
});

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const waitForPageLoad = () => {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    window.addEventListener("load", resolve, { once: true });
  });
};

const waitForFontsReady = () => {
  if (!("fonts" in document) || typeof document.fonts.ready === "undefined") {
    return Promise.resolve();
  }

  return document.fonts.ready.catch(() => undefined);
};

const waitForTransitionEnd = (element, maxWaitMs) => {
  if (!(element instanceof HTMLElement)) {
    return delay(maxWaitMs);
  }

  return new Promise(resolve => {
    let resolved = false;

    const done = () => {
      if (resolved) {
        return;
      }

      resolved = true;
      element.removeEventListener("transitionend", onEnd);
      resolve();
    };

    const onEnd = event => {
      if (event.target !== element) {
        return;
      }

      done();
    };

    element.addEventListener("transitionend", onEnd);
    window.setTimeout(done, Math.max(0, maxWaitMs));
  });
};

const shouldRunInitialIntro = () => {
  try {
    if (sessionStorage.getItem(SESSION_KEY_HAS_SEEN_INTRO) === "true") {
      return false;
    }

    sessionStorage.setItem(SESSION_KEY_HAS_SEEN_INTRO, "true");
    return true;
  } catch {
    return true;
  }
};

const clearIntroClasses = () => {
  document.documentElement.classList.remove(INTRO_BOOT_CLASS);
  document.body.classList.remove(INITIAL_LOADING_EXIT_CLASS);
  document.body.classList.remove(INITIAL_LOADING_CLASS);
};

const runInitialIntro = async () => {
  if (!shouldRunInitialIntro()) {
    clearIntroClasses();
    return;
  }

  if (prefersReducedMotion()) {
    clearIntroClasses();
    return;
  }

  const timings = getTimings();
  const overlay = document.querySelector("[data-site-transition]");

  document.body.classList.add(INITIAL_LOADING_CLASS);

  await Promise.race([
    Promise.all([
      delay(timings.introMinHold),
      waitForPageLoad(),
      waitForFontsReady(),
    ]),
    delay(timings.introMaxWait),
  ]);

  if (navigationInProgress) {
    return;
  }

  document.body.classList.add(INITIAL_LOADING_EXIT_CLASS);
  await waitForTransitionEnd(overlay, timings.introFadeDuration + 120);

  if (navigationInProgress) {
    return;
  }

  clearIntroClasses();
};

const isModifiedClick = event =>
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  event.button !== 0;

const isSamePageHashLink = url => {
  const hasHash = Boolean(url.hash);
  if (!hasHash) {
    return false;
  }

  return (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  );
};

const isInternalLink = url => url.origin === window.location.origin;

const shouldIgnoreLink = (anchor, event) => {
  if (!(anchor instanceof HTMLAnchorElement)) {
    return true;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) {
    return true;
  }

  if (
    anchor.hasAttribute("download") ||
    anchor.target === "_blank" ||
    anchor.dataset.noTransition === "true"
  ) {
    return true;
  }

  if (isModifiedClick(event)) {
    return true;
  }

  const url = new URL(anchor.href, window.location.href);

  if (!isInternalLink(url)) {
    return true;
  }

  if (isSamePageHashLink(url)) {
    return true;
  }

  if (url.protocol === "mailto:" || url.protocol === "tel:") {
    return true;
  }

  if (url.href === window.location.href) {
    return true;
  }

  return false;
};

const startPageTransition = href => {
  if (navigationInProgress) {
    return;
  }

  navigationInProgress = true;
  document.body.classList.add(TRANSITION_CLASS);
  clearIntroClasses();

  const { transitionDuration } = getTimings();
  const transitionDelay = prefersReducedMotion() ? 0 : transitionDuration;

  window.setTimeout(() => {
    window.location.assign(href);
  }, transitionDelay);
};

const onDocumentClick = event => {
  const anchor =
    event.target instanceof Element ? event.target.closest("a[href]") : null;

  if (!anchor || shouldIgnoreLink(anchor, event)) {
    return;
  }

  event.preventDefault();
  startPageTransition(anchor.href);
};

const clearTransitionState = () => {
  navigationInProgress = false;
  document.body.classList.remove(TRANSITION_CLASS);
  clearIntroClasses();
};

document.addEventListener("click", onDocumentClick);
window.addEventListener("pageshow", clearTransitionState);
window.addEventListener(
  "load",
  () => {
    if (navigationInProgress) {
      return;
    }

    clearTransitionState();
  },
  { once: true },
);

runInitialIntro().catch(() => {
  clearIntroClasses();
});
