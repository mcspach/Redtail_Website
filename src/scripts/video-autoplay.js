/**
 * Play looping background videos only while they are on screen.
 *
 * Replaces the `autoplay` attribute, which made every browser download every
 * video on page load whether or not the visitor ever scrolled to it. Videos
 * now ship with `preload="none"` and a poster image, so they cost zero bytes
 * until they actually come into view.
 *
 * Opt in from markup with `data-video-autoplay` on a <video>.
 */

const SELECTOR = 'video[data-video-autoplay]';

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * play() returns a promise that rejects in situations we can't control —
 * iOS Low Power Mode, an autoplay policy that hasn't seen user interaction,
 * a decode error. An unhandled rejection there would surface as a console
 * error on an otherwise healthy page, so swallow it and leave the poster up.
 */
const safePlay = (video) => {
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {});
  }
};

const init = () => {
  const videos = document.querySelectorAll(SELECTOR);
  if (!videos.length) return;

  // Respect the OS-level motion preference: leave the poster in place rather
  // than looping video at someone who asked for less movement. Videos that
  // carry meaning (not aria-hidden decoration) get controls so they are still
  // reachable by choice.
  if (prefersReducedMotion()) {
    videos.forEach((video) => {
      if (video.getAttribute('aria-hidden') !== 'true') {
        video.controls = true;
      }
    });
    return;
  }

  // Without IntersectionObserver, fall back to the old behavior rather than
  // shipping a page of permanently frozen posters.
  if (!('IntersectionObserver' in window)) {
    videos.forEach(safePlay);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          safePlay(video);
        } else if (!video.paused) {
          video.pause();
        }
      });
    },
    // Start slightly before the video scrolls in so playback has begun by the
    // time it is actually visible.
    { rootMargin: '200px 0px', threshold: 0.01 },
  );

  videos.forEach((video) => observer.observe(video));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
