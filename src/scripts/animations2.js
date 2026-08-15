import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire resize whenever the URL bar collapses or expands during
// scroll. Keep ScrollTrigger from refreshing itself on those height-only events.
ScrollTrigger.config({ ignoreMobileResize: true });

// Add or remove selectors here.
const scrollRevealTargets = [
  ".contact__content h3",
  ".case-studies__title",
  ".portfolio-list__title",
  ".feature-row__title",
  ".contact-form-section h3",
];
const scrollFadeUpTargets = [
  ".testimonial__card",
  ".contact__card",
  ".case-studies__panel",
  ".portfolio-list__item",
  ".services-list__card",
  ".feature-row",
];
const heroLrgReveal = [
  ".hero-lrg__eyebrow",
  ".hero-lrg__title",
  ".hero-lrg__subheadline",
  ".hero-lrg__rating",
  ".hero-lrg__quote",
  ".hero-lrg__actions .hero-lrg__button",
];
const heroMdReveal = [
  ".hero-md__eyebrow",
  ".hero-md__title",
  ".hero-md__subheadline",
];

const activeSplits = [];
const activeTriggers = [];

// Nodes whose entrance animation has already run. A width-change rebuild
// must restore these to their finished state, not replay them.
const playedNodes = new WeakSet();

// While the transition curtain covers the page, hold entrance animations so
// they play as the curtain lifts instead of finishing unseen behind it.
// animations.js dispatches this event the moment the curtain starts to lift.
const OVERLAY_REVEAL_EVENT = "redtail:overlay-reveal";

// Beat between the curtain starting to lift and the hero animating in,
// so the hero starts roughly as the curtain clears its area.
const HERO_REVEAL_DELAY = 0.35;

const overlayIsCovering = () =>
  document.documentElement.classList.contains("rt-intro-boot") ||
  document.documentElement.classList.contains("rt-nav-boot") ||
  (document.body.classList.contains("is-initial-loading") &&
    !document.body.classList.contains("is-initial-loading-exit"));

const whenOverlayRevealed = callback => {
  if (!overlayIsCovering()) {
    callback();
    return;
  }

  document.addEventListener(OVERLAY_REVEAL_EVENT, () => callback(), {
    once: true,
  });
};

const revealStates = {
  lines: {
    yPercent: 75,
    opacity: 0,
  },
  chars: {
    yPercent: 90,
    opacity: 0,
  },
};

// Finished state for split text, used when a rebuild re-splits a node whose
// reveal already played.
const revealedState = {
  yPercent: 0,
  opacity: 1,
};

// Distance a fade-up element travels. Shared so the hidden state and the
// timeline's `from` value cannot drift apart.
const FADE_UP_OFFSET = 75;

const buildRevealTimeline = split => {
  const timeline = gsap.timeline({
    paused: true,
  });

  timeline.to(split.lines, {
    yPercent: 0,
    opacity: 1,
    duration: 0.65,
    ease: "power3.out",
    stagger: 0.075,
  });

  split.lines.forEach((line, lineIndex) => {
    const chars = line.querySelectorAll(".char");

    timeline.to(
      chars,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
      },
      lineIndex * 0.12,
    );
  });

  return timeline;
};

const buildFadeUpTimeline = node => {
  const timeline = gsap.timeline({
    paused: true,
  });

  timeline.fromTo(
    node,
    {
      y: FADE_UP_OFFSET,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform,opacity",
    },
  );

  return timeline;
};

const buildHeroRevealTimeline = elements => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    elements,
    {
      y: 28,
      opacity: 0,
      skewY: 4,
      scaleY: 1.12,
      transformOrigin: "center top",
    },
    {
      y: 0,
      opacity: 1,
      skewY: 0,
      scaleY: 1,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.2,
      clearProps: "transform,opacity",
    },
  );

  return timeline;
};

const setupRevealForNode = node => {
  const split = new SplitType(node, {
    types: "lines,words,chars",
    tagName: "span",
  });

  activeSplits.push(split);

  split.lines.forEach(line => {
    line.style.display = "block";
    line.style.overflow = "hidden";
  });

  split.words.forEach(word => {
    // Keep words intact so character spans cannot wrap across lines.
    word.style.whiteSpace = "nowrap";
  });

  // A rebuild re-splits for the new line breaks, but a reveal the user has
  // already watched must come back finished rather than replay.
  if (playedNodes.has(node)) {
    gsap.set(split.lines, revealedState);
    gsap.set(split.chars, revealedState);
    return;
  }

  gsap.set(split.lines, revealStates.lines);
  gsap.set(split.chars, revealStates.chars);

  const timeline = buildRevealTimeline(split);

  const play = () => {
    playedNodes.add(node);
    timeline.restart(true);
  };

  const trigger = ScrollTrigger.create({
    trigger: node,
    start: "top 85%",
    onEnter: play,
    // onEnterBack: () => timeline.restart(true),
    // onLeaveBack: () => timeline.pause(0),
  });

  activeTriggers.push(trigger);

  if (trigger.isActive) {
    whenOverlayRevealed(play);
  }
};

const setupFadeUpForNode = node => {
  if (playedNodes.has(node)) {
    gsap.set(node, {
      y: 0,
      opacity: 1,
      clearProps: "transform,opacity",
    });
    return;
  }

  gsap.set(node, {
    y: FADE_UP_OFFSET,
    opacity: 0,
  });

  const timeline = buildFadeUpTimeline(node);

  const play = () => {
    playedNodes.add(node);
    timeline.restart(true);
  };

  const trigger = ScrollTrigger.create({
    trigger: node,
    start: "top 85%",
    onEnter: play,
  });

  activeTriggers.push(trigger);

  if (trigger.isActive) {
    whenOverlayRevealed(play);
  }
};

const setupHeroReveal = selectors => {
  const elements = selectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector)),
  );

  if (!elements.length) {
    return;
  }

  // The hero holds no split text, so a rebuild has nothing to redo here. Bail
  // before the hide below, which is what makes it flash on every resize.
  if (elements.every(element => playedNodes.has(element))) {
    return;
  }

  elements.forEach(element => playedNodes.add(element));

  gsap.set(elements, {
    y: 28,
    opacity: 0,
    skewY: 4,
    scaleY: 1.12,
    transformOrigin: "center top",
  });

  whenOverlayRevealed(() =>
    gsap.delayedCall(HERO_REVEAL_DELAY, () =>
      buildHeroRevealTimeline(elements).play(0),
    ),
  );
};

const buildTextReveals = () => {
  activeSplits.forEach(split => split.revert());
  activeSplits.length = 0;

  activeTriggers.forEach(trigger => trigger.kill());
  activeTriggers.length = 0;

  scrollRevealTargets.forEach(selector => {
    const nodes = document.querySelectorAll(selector);

    nodes.forEach(node => {
      setupRevealForNode(node);
    });
  });

  setupHeroReveal(heroLrgReveal);
  setupHeroReveal(heroMdReveal);

  scrollFadeUpTargets.forEach(selector => {
    const nodes = document.querySelectorAll(selector);

    nodes.forEach(node => {
      setupFadeUpForNode(node);
    });
  });

  ScrollTrigger.refresh();
};

buildTextReveals();

let lastWidth = window.innerWidth;
let resizeTimer;

window.addEventListener("resize", () => {
  const width = window.innerWidth;

  // Mobile URL-bar show/hide fires resize with a height-only change, and a
  // rebuild there would re-trigger every animation mid-scroll. SplitType line
  // boxes only depend on width, so there is nothing to redo.
  if (width === lastWidth) {
    return;
  }

  lastWidth = width;
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildTextReveals, 200);
});
