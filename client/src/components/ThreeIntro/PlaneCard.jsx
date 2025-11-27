import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Text } from "@react-three/drei";

const PlaneCard = ({ playFall, progress }) => {
  const cardRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    if (playFall && cardRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      // anticipation tilt
      tl.to(cardRef.current.rotation, { x: -0.15, duration: 0.3 });

      // main fall
      tl.to(
        cardRef.current.position,
        { y: -3.5, z: -2, duration: 1.8 },
        "<"
      );
      tl.to(cardRef.current.rotation, { x: -1.35, duration: 1.8 }, "<");
      tl.to(cardRef.current.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1.8 }, "<");
    }
  }, [playFall]);

  return (
    <group>
      {/* Falling white card */}
      <mesh
        ref={cardRef}
        position={[0, 0, 0]}
        rotation={[-0.1, 0, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[3.5, 2, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 3D text “stuck” on the card */}
      <Text
        ref={textRef}
        position={[0, 0.2, 0.11]} // slightly above card surface
        fontSize={0.5}
        color="#111"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {progress}%
      </Text>

      {/* small “creating your experience” line below */}
      <Text
        position={[0, -0.3, 0.11]}
        fontSize={0.1}
        color="#444"
        anchorX="center"
        anchorY="middle"
      >
        Creating your experience…
      </Text>
    </group>
  );
};

export default PlaneCard;
