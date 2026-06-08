import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

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

const revealStates = {
  lines: {
    yPercent: 100,
    opacity: 0,
  },
  chars: {
    yPercent: 120,
    opacity: 0,
  },
};

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
      y: 75,
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
    types: "lines,chars",
    tagName: "span",
  });

  activeSplits.push(split);

  split.lines.forEach(line => {
    line.style.display = "block";
    line.style.overflow = "hidden";
  });

  gsap.set(split.lines, revealStates.lines);
  gsap.set(split.chars, revealStates.chars);

  const timeline = buildRevealTimeline(split);

  const trigger = ScrollTrigger.create({
    trigger: node,
    start: "top 85%",
    onEnter: () => timeline.restart(true),
    // onEnterBack: () => timeline.restart(true),
    // onLeaveBack: () => timeline.pause(0),
  });

  activeTriggers.push(trigger);

  if (trigger.isActive) {
    timeline.restart(true);
  }
};

const setupFadeUpForNode = node => {
  gsap.set(node, {
    y: 28,
    opacity: 0,
  });

  const timeline = buildFadeUpTimeline(node);

  const trigger = ScrollTrigger.create({
    trigger: node,
    start: "top 85%",
    onEnter: () => timeline.restart(true),
  });

  activeTriggers.push(trigger);

  if (trigger.isActive) {
    timeline.restart(true);
  }
};

const setupHeroReveal = selectors => {
  const elements = selectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector)),
  );

  if (!elements.length) {
    return;
  }

  gsap.set(elements, {
    y: 28,
    opacity: 0,
    skewY: 4,
    scaleY: 1.12,
    transformOrigin: "center top",
  });

  buildHeroRevealTimeline(elements).play(0);
};

const buildTextReveals = () => {
  activeSplits.forEach(split => split.revert());
  activeSplits.length = 0;

  activeTriggers.forEach(trigger => trigger.kill());
  activeTriggers.length = 0;

  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

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

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildTextReveals, 200);
});
