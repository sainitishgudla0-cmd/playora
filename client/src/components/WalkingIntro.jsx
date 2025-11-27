import React, { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import gsap from "gsap";

const WalkingIntro = React.forwardRef(({ onComplete }, ref) => {
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let c = 0;
    const interval = setInterval(() => {
      c += Math.floor(Math.random() * 8) + 4;
      if (c >= 100) {
        c = 100;
        clearInterval(interval);

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        // Step 1: Text slightly floats up then falls back with delay
        tl.to(contentRef.current, {
          y: "-5vh",
          duration: 0.4,
          ease: "power2.out",
        });

        // Step 2: Both card and text fall down together with perspective depth
        tl.to(
          panelRef.current,
          {
            y: "50vh",
            rotateX: 75,
            scale: 0.95,
            transformOrigin: "bottom center",
            duration: 1.8,
          },
          "+=0.1"
        );

        tl.to(
          contentRef.current,
          {
            y: "60vh",
            scale: 0.85,
            opacity: 0.6, // keep visible for realism
            duration: 1.8,
          },
          "<+0.1" // lags slightly behind the panel
        );

        // Step 3: Fade the overlay only after fall completes
        tl.to(ref.current, {
          opacity: 0,
          duration: 1,
          delay: -0.3,
          onComplete: () => {
            if (ref.current) ref.current.style.display = "none";
            if (onComplete) onComplete();
          },
        });
      }
      setProgress(c);
    }, 120);

    return () => clearInterval(interval);
  }, [ref, onComplete]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden perspective-[1200px]"
    >
      {/* Falling white card */}
      <div
        ref={panelRef}
        className="absolute inset-0 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
        style={{
          transformOrigin: "bottom center",
          transform: "rotateX(0deg)",
        }}
      />

      {/* Lottie background */}
      <div className="absolute inset-0 opacity-50">
        <Player
          autoplay
          loop
          src="/animations/walking-people.json"
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Loading text */}
      <div
        ref={contentRef}
        className="relative z-10 text-center text-white mix-blend-difference"
      >
        <p className="uppercase tracking-[0.3em] text-xs mb-3">Heavensinn</p>
        <h1 className="text-9xl md:text-[12rem] font-bold leading-none">
          {progress}%
        </h1>
        <p className="text-xs mt-3 opacity-60">Creating your experience…</p>
      </div>
    </div>
  );
});

export default WalkingIntro;
