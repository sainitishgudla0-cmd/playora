import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = React.forwardRef((props, ref) => {
  const textRef = useRef(null);
  const subRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Phase 1: Text reveal
    tl.fromTo(
      textRef.current,
      { scale: 0.8, opacity: 0, letterSpacing: "0.5em" },
      { scale: 1, opacity: 1, letterSpacing: "0.05em", duration: 1.5, ease: "power4.out" }
    )
      // Phase 2: Subtext fade in
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      )
      // Phase 3: Gentle shimmer across text
      .to(
        glowRef.current,
        {
          x: "120%",
          duration: 2,
          ease: "power2.inOut",
          repeat: 1,
          yoyo: true,
        },
        "-=0.5"
      )
      // Phase 4: Fade everything away
      .to(
        [textRef.current, subRef.current],
        { opacity: 0, scale: 1.05, duration: 1.4, ease: "power3.inOut", delay: 0.6 },
        "+=0.8"
      );
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
    >
      <div className="relative overflow-hidden">
        {/* Glow sweep */}
        <span
          ref={glowRef}
          className="absolute top-0 left-[-50%] h-full w-[60%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-lg"
        />
        {/* Main text */}
        <h1
          ref={textRef}
          className="text-[12vw] font-extrabold tracking-tight leading-none select-none"
          style={{
            fontFamily: "serif",
            letterSpacing: "-0.02em",
            textShadow: "0 0 20px rgba(255,255,255,0.25)",
          }}
        >
          HEAVENSINN
        </h1>
      </div>

      {/* Subtitle */}
      <p
        ref={subRef}
        className="text-sm mt-6 tracking-wider uppercase text-white/70 font-light"
      >
        Where Luxury Meets Serenity
      </p>
    </div>
  );
});

export default Loader;
