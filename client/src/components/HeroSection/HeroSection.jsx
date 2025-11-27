import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import WaterDrop from "./WaterDrop";

const HeroSection = () => {
  const navigate = useNavigate();
  const bgRef = useRef(null);
  const cubeRef = useRef(null);
  const titleRef = useRef(null);
  const labelRef = useRef(null);
  const [time, setTime] = useState("");

  // 🕒 Hyderabad Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // 🌧️ Background Animation (unchanged)
  useEffect(() => {
    const container = bgRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 1024;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 75 : 65,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, isMobile ? 26 : 15);
    camera.lookAt(0, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1.5);
    scene.add(hemiLight);

    const cubeCount = isMobile ? 75 : 150;
    const geom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const mat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.7,
      metalness: 0.2,
      opacity: 0.8,
      transparent: true,
    });
    const instanced = new THREE.InstancedMesh(geom, mat, cubeCount);
    const dummy = new THREE.Object3D();
    const cubeSpeeds = [];
    const rand = (range = 100) => (Math.random() - 0.5) * range;

    for (let i = 0; i < cubeCount; i++) {
      dummy.position.set(rand(isMobile ? 75 : 150), Math.random() * 25 + 10, rand(isMobile ? 20 : 60));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
      cubeSpeeds.push(0.008 + Math.random() * 0.012);
    }
    scene.add(instanced);

    const loader = new GLTFLoader();
    const models = [];
    const modelPaths = ["/models/baseball_bat.glb", "/models/chesspawn.glb", "/models/tennisball.glb"];

    const loadModels = () => {
      modelPaths.forEach((path) => {
        loader.load(
          path,
          (gltf) => {
            const base = gltf.scene;
            for (let i = 0; i < (isMobile ? 5 : 15); i++) {
              const clone = base.clone();
              let scale = 0.5 + Math.random() * 0.2;
              if (path.includes("baseball_bat")) scale = 0.08 + Math.random() * 0.04;
              if (path.includes("tennisball")) scale = 0.25 + Math.random() * 0.1;
              if (path.includes("chesspawn")) scale = 0.14 + Math.random() * 0.04;
              clone.scale.set(scale, scale, scale);
              clone.position.set(rand(isMobile ? 40 : 80), Math.random() * 25 + 10, rand(isMobile ? 20 : 50));
              clone.rotation.x = Math.random() * Math.PI;
              clone.rotation.y = Math.random() * Math.PI;
              scene.add(clone);
              models.push(clone);
            }
          },
          undefined,
          (err) => console.error(`Error loading ${path}:`, err)
        );
      });
    };
    const modelTimeout = setTimeout(loadModels, 1000);

    let prev = 0;
    const animate = (now = 0) => {
      requestAnimationFrame(animate);
      const delta = now - prev;
      if (delta < 16) return;
      prev = now;

      for (let i = 0; i < cubeCount; i++) {
        instanced.getMatrixAt(i, dummy.matrix);
        dummy.position.setFromMatrixPosition(dummy.matrix);
        dummy.rotation.x += 0.01;
        dummy.rotation.y += 0.015;
        dummy.position.y -= cubeSpeeds[i];
        if (dummy.position.y < -15) {
          dummy.position.y = Math.random() * 25 + 10;
          dummy.position.x = rand(isMobile ? 50 : 100);
          dummy.position.z = rand(isMobile ? 20 : 60);
        }
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;

      models.forEach((m) => {
        m.position.y -= 0.025;
        m.rotation.x += 0.006;
        m.rotation.y += 0.01;
        if (m.position.y < -15) {
          m.position.y = Math.random() * 25 + 10;
          m.position.x = rand(isMobile ? 50 : 100);
          m.position.z = rand(isMobile ? 20 : 60);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(modelTimeout);
      window.removeEventListener("resize", resize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // ✨ Text Animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      cubeRef.current,
      { x: 200, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2 },
      0.3
    )
      .fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.8)
      .fromTo(labelRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white font-[Poppins] select-none flex flex-col justify-center items-center">
      {/* 3D Background */}
      <div ref={bgRef} className="absolute inset-0 z-0" />

      {/* DESKTOP */}
      <div className="hidden lg:flex flex-row items-center justify-between w-[90%] max-w-[1400px] mx-auto h-full relative z-10">
        <div className="flex flex-col items-start justify-center w-1/2 text-left space-y-5">
          <motion.div ref={labelRef} className="uppercase tracking-[0.25em] text-sm text-gray-500">
            LUXURY REDEFINED
          </motion.div>

          <motion.h1 ref={titleRef} className="text-[4.5vw] font-semibold font-bileha leading-tight text-black">
            WELCOME TO <br /> JOY NOOK
          </motion.h1>

          <p className="text-base font-Outfit text-gray-600 leading-relaxed max-w-md">
            Escape into a world where luxury meets play. <br />
            Stay, unwind, and relive the joy of every game.
          </p>

          <div className="flex gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/rooms")}
              className="border border-black rounded-full px-12 py-3 text-xl font-bileha font-semibold tracking-wide hover:bg-lime-400 hover:text-black transition-all duration-300"
            >
              ROOMS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/games")}
              className="border border-black rounded-full px-12 py-3 text-xl font-bileha font-semibold tracking-wide hover:bg-lime-400 hover:text-black transition-all duration-300"
            >
              GAMES & SPORTS
            </motion.button>
          </div>
        </div>

{/* CUBE + "PLAY ME" LABEL */}
<div
  ref={cubeRef}
  className="w-1/2 flex flex-col items-center justify-center relative"
>
  <div className="relative flex items-center justify-center">
    <div className="w-[550px] h-[550px] flex items-center justify-center">
      <WaterDrop scaleFactor={0.95} />
    </div>

    {/* Floating arrow + label */}
    <div className="absolute -bottom-10 flex flex-col items-center select-none">
      <motion.span
        initial={{ y: 4, opacity: 0.4 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="text-gray-500 text-lg"
      >
        ↑
      </motion.span>

      <p className="text-sm uppercase tracking-[0.7em] text-gray-500 font-medium">
        PLAY ME
      </p>
    </div>
  </div>
</div>

      </div>

      {/* MOBILE */}
      <div className="flex lg:hidden flex-col items-center justify-center text-center relative z-10 px-4 w-full pt-24">
        <motion.div ref={labelRef} className="uppercase tracking-[0.25em] text-xs text-gray-500 mb-2">
          LUXURY REDEFINED
        </motion.div>

        <motion.h1 ref={titleRef} className="text-[9vw] font-semibold font-bileha leading-tight text-black">
          WELCOME TO <br /> JOY NOOK
        </motion.h1>

        <p className="mt-2 text-[0.7rem] sm:text-sm font-Outfit text-gray-600 leading-relaxed max-w-xs mx-auto">
          Escape into a world where luxury meets play. <br />
          Stay, unwind, and relive the joy of every game.
        </p>

        <div className="flex flex-row flex-wrap justify-center gap-3 mt-4 mb-5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/rooms")}
            className="border border-black rounded-full px-6 py-2 text-sm font-bileha font-semibold hover:bg-lime-400 hover:text-black transition-all duration-300"
          >
            ROOMS
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/games")}
            className="border border-black rounded-full px-6 py-2 text-sm font-bileha font-semibold hover:bg-lime-400 hover:text-black transition-all duration-300"
          >
            GAMES & SPORTS
          </motion.button>
        </div>

        {/* MOBILE CUBE + LABEL */}
        <div ref={cubeRef} className="flex flex-col items-center justify-center mb-[1vh]">
          <div className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
            <WaterDrop />
          </div>
          <div className="flex flex-col items-center select-none">
  <motion.span
    initial={{ y: 3, opacity: 0.5 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.3, ease: "easeInOut" }}
    className="text-gray-500 text-sm"
  >
    ↑
  </motion.span>
  <p className="text-[10px] uppercase tracking-[0.25em] mt-1 text-gray-500 font-medium">
    PLAY ME
  </p>
</div>
        </div>
      </div>

      {/* CLOCK */}
      <div className="absolute bottom-6 text-gray-600 text-xs sm:text-sm tracking-wider font-medium z-10">
        HYDERABAD_{time}
      </div>
    </section>
  );
};

export default HeroSection;
