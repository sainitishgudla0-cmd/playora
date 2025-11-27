import React, { useRef } from "react";
import Home from "./Home";
import WalkingIntro from "../components/WalkingIntro";

const AnimatedHome = () => {
  const overlayRef = useRef(null);

  return (
    <div className="relative">
      <Home />
      <WalkingIntro ref={overlayRef} />
    </div>
  );
};

export default AnimatedHome;
