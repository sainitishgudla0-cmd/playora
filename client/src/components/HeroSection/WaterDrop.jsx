import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function WaterDrop({ scaleFactor = 1 }) {  // ✅ added optional prop
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 15, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    const dir = new THREE.DirectionalLight(0xffffff, 1.3);
    dir.position.set(5, 6, 4);
    scene.add(ambient, dir);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Colors
    const COLORS = ["#d00000", "#ff8800", "#009b48", "#0046ad", "#ffffff", "#ffd500"];
    const cubeGroup = new THREE.Group();

    cubeGroup.scale.set(1.8 * scaleFactor, 1.8 * scaleFactor, 1.8 * scaleFactor); // ✅ added scale factor
    scene.add(cubeGroup);

    // Cubelets
    const cubelets = [];
    const geom = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const mat = new THREE.MeshPhysicalMaterial({
            color: COLORS[(x + y + z + 6) % COLORS.length],
            roughness: 0.45,
            metalness: 0.05,
            clearcoat: 1,
            clearcoatRoughness: 0.25,
          });
          const cubelet = new THREE.Mesh(geom, mat);
          cubelet.position.set(x, y, z);
          cubeGroup.add(cubelet);
          cubelets.push(cubelet);
        }
      }
    }

    // ✅ Rotation Logic (unchanged)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let rotating = false;

    const rotateLayer = (axis, layer, clockwise = true) => {
      if (rotating) return;
      rotating = true;

      const LAYER_TOL = 0.5;
      const layerObjs = cubelets.filter(
        (c) => Math.abs(c.position[axis] - layer) < LAYER_TOL
      );

      const axVec =
        axis === "x"
          ? new THREE.Vector3(1, 0, 0)
          : axis === "y"
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1);

      const angle = (Math.PI / 2) * (clockwise ? 1 : -1);
      const startQuats = layerObjs.map((c) => c.quaternion.clone());
      const startPositions = layerObjs.map((c) => c.position.clone());

      gsap.to({ t: 0 }, {
        t: 1,
        duration: 0.4,
        ease: "power2.inOut",
        onUpdate: function () {
          const currentAngle = angle * this.targets()[0].t;
          const qStep = new THREE.Quaternion().setFromAxisAngle(axVec, currentAngle);
          const mStep = new THREE.Matrix4().makeRotationFromQuaternion(qStep);

          layerObjs.forEach((c, i) => {
            c.quaternion.copy(startQuats[i]).multiply(qStep);
            c.position.copy(startPositions[i]).applyMatrix4(mStep);
          });
        },
        onComplete: () => {
          const qFinal = new THREE.Quaternion().setFromAxisAngle(axVec, angle);
          layerObjs.forEach((c, i) => {
            c.quaternion.copy(startQuats[i]).multiply(qFinal);
            c.position.copy(startPositions[i]).applyMatrix4(
              new THREE.Matrix4().makeRotationFromQuaternion(qFinal)
            );
            c.position.set(
              Math.round(c.position.x),
              Math.round(c.position.y),
              Math.round(c.position.z)
            );
          });
          rotating = false;
        },
      });
    };

    const onClick = (e) => {
      if (rotating) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubelets);
      if (!intersects.length) return;
      const hit = intersects[0].object;
      const n = intersects[0].face.normal
        .clone()
        .applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.matrixWorld))
        .normalize();

      let axis = "x";
      let layer = Math.round(hit.position.x);
      const ax = Math.abs(n.x),
        ay = Math.abs(n.y),
        az = Math.abs(n.z);

      if (ay > ax && ay > az) {
        axis = "y";
        layer = Math.round(hit.position.y);
      } else if (az > ax && az > ay) {
        axis = "z";
        layer = Math.round(hit.position.z);
      }

      const clockwise = e.clientY < window.innerHeight / 2;
      rotateLayer(axis, layer, clockwise);
    };

    renderer.domElement.addEventListener("mousedown", onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      cubeGroup.rotation.y += 0.003;
      cubeGroup.rotation.x += 0.0015;
      controls.update();
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
      renderer.dispose();
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("mousedown", onClick);
    };
  }, [scaleFactor]); // ✅ added dependency

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
        cursor: "pointer",
        zIndex: 0,
      }}
      ref={containerRef}
    />
  );
}
