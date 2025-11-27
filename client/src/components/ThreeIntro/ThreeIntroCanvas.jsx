import React, { useEffect, useRef, useState, forwardRef } from "react";
import gsap from "gsap";

const ThreeIntro = forwardRef(({ onComplete }, ref) => {
  const [progress, setProgress] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const wrapRef = ref || containerRef;

  useEffect(() => {
    const counter = { val: 0 };

    gsap.to(counter, {
      val: 100,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => setProgress(Math.floor(counter.val)),
      onComplete: () => {
        setIsFlipping(true);

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            // Smooth fade-out
            gsap.to(wrapRef.current, {
              opacity: 0,
              duration: 1,
              ease: "power2.inOut",
              onComplete: () => {
                if (wrapRef.current) {
                  wrapRef.current.style.pointerEvents = "none";
                  wrapRef.current.style.background = "#fff";
                }
                onComplete && onComplete();
              },
            });
          },
        });

        // anticipation motion
        tl.to(pageRef.current, {
          rotateX: -5,
          duration: 0.25,
          ease: "power1.out",
        });

        // main card flip
        tl.to(pageRef.current, {
          rotateX: 95,
          transformOrigin: "bottom center",
          duration: 1.4,
          ease: "power3.inOut",
        });
      },
    });
  }, [onComplete, wrapRef]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        perspective: "1600px",
        perspectiveOrigin: "center bottom",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        ref={pageRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #ffffff 0%, #f5f5f5 80%)",
          color: "black",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin: "bottom center",
          boxShadow: "0 40px 160px rgba(0,0,0,0.1)",
          transform: "rotateX(0deg)",
        }}
      >
        <p
          style={{
            letterSpacing: "0.4em",
            fontSize: 12,
            opacity: isFlipping ? 0.7 : 1,
            transition: "opacity 0.4s",
            color: "#333",
          }}
        >
          AVERO STAY
        </p>

        <div
          style={{
            fontSize: "9rem",
            fontWeight: 700,
            color: "#000",
          }}
        >
          {progress}%
        </div>

        <p style={{ fontSize: 12, marginTop: 12, opacity: 0.5, color: "#555" }}>
          Creating your experience…
        </p>
      </div>
    </div>
  );
});

export default ThreeIntro;
