import { motion, useScroll } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const ScrollScaleRow = ({ children }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [yOffset, setYOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = rowCenter - viewportCenter;

      const maxDist = window.innerHeight / 1.2;

      // Move upward or downward based on distance
      const offset = Math.min(Math.max(distance * -0.25, -90), 100);
      setYOffset(offset);

      
    });

    return () => unsub();
  }, [scrollY]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: yOffset,
        opacity,
        willChange: "transform, opacity",
        transition: "transform 0.25s ease-out, opacity 0.05s ease-out",
      }}
      className="grid grid-cols-1 md:grid-cols-2 w-full h-[80vh] overflow-hidden" // leave 10vh for navbar
    >
      {children}
    </motion.div>
  );
};

export default ScrollScaleRow;
