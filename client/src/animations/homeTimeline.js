import gsap from "gsap";

export const homeTimeline = (loaderRef, mainRef) => {
  const tl = gsap.timeline();

  // we don't hide mainRef now — it's already visible

  tl.to(loaderRef.current, {
    opacity: 0,
    duration: 1,
    delay: 2.2, // how long you want to show HEAVENSINN
    ease: "power2.inOut",
  }).set(loaderRef.current, { display: "none" });

  return tl;
};
