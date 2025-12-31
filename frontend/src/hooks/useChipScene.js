import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initChipScene() {
  const canvas = document.getElementById("chip-canvas");

  /* ================= SCENE ================= */

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050507");

  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 4, 7);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  /* ================= LIGHTING ================= */

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(5, 8, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(-3, 3, -2);
  scene.add(fillLight);

  const redLight = new THREE.PointLight(0xc1121f, 0, 12);
  redLight.position.set(0, 0.5, 0);
  scene.add(redLight);

  /* ================= MATERIAL ================= */

  const siliconMat = new THREE.MeshStandardMaterial({
    color: "#0f1116",
    metalness: 0.35,
    roughness: 0.55
  });

  const coreMat = new THREE.MeshStandardMaterial({
    color: "#1a1b20",
    emissive: "#c1121f",
    emissiveIntensity: 0
  });

  /* ================= CHIP GEOMETRY ================= */

  const layers = [];
  const layerGeo = new THREE.BoxGeometry(8, 0.1, 8);

  for (let i = 0; i < 3; i++) {
    const layer = new THREE.Mesh(layerGeo, siliconMat.clone());
    layer.material.roughness = 0.55 - i * 0.05;
    layer.position.y = i * 0.04;
    scene.add(layer);
    layers.push(layer);
  }

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.15, 3.2),
    coreMat
  );
  core.position.y = 0.12;
  scene.add(core);

  /* ================= EDGE PINS ================= */

  const pinGeo = new THREE.BoxGeometry(0.16, 0.04, 0.24);
  const pinMat = new THREE.MeshStandardMaterial({
    color: "#3a3a3e",
    metalness: 0.9,
    roughness: 0.2
  });

  for (let i = -18; i <= 18; i++) {
    const pin1 = new THREE.Mesh(pinGeo, pinMat);
    pin1.position.set(i * 0.22, -0.02, 4.1);
    scene.add(pin1);

    const pin2 = new THREE.Mesh(pinGeo, pinMat);
    pin2.position.set(i * 0.22, -0.02, -4.1);
    scene.add(pin2);
  }

  for (let i = -17; i <= 17; i++) {
    const pin3 = new THREE.Mesh(pinGeo, pinMat);
    pin3.rotation.y = Math.PI / 2;
    pin3.position.set(-4.1, -0.02, i * 0.22);
    scene.add(pin3);

    const pin4 = new THREE.Mesh(pinGeo, pinMat);
    pin4.rotation.y = Math.PI / 2;
    pin4.position.set(4.1, -0.02, i * 0.22);
    scene.add(pin4);
  }

  /* ================= GSAP TIMELINE ================= */

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "+=220%",
      scrub: true,
      pin: true
    }
  });

  layers.forEach((layer, i) => {
    tl.from(layer.position, {
      y: -0.5 + i * 0.04,
      opacity: 0,
      duration: 1
    }, i * 0.2);
  });

  tl.from(core.scale, {
    x: 0,
    y: 0,
    z: 0,
    ease: "back.out(1.5)",
    duration: 0.8
  }, "-=0.3");

  tl.to(coreMat, {
    emissiveIntensity: 1.2,
    ease: "power2.inOut",
    duration: 1
  }, "-=0.3");

  tl.to(redLight, {
    intensity: 5,
    ease: "power2.inOut",
    duration: 1
  }, "<");

  tl.to(camera.rotation, {
    x: -0.2,
    ease: "none"
  }, 0);

  /* ================= RENDER LOOP ================= */

  let animationId;

  function animate() {
    const t = performance.now() * 0.0001;
    camera.position.x = Math.sin(t) * 0.0005;
    camera.position.z = 7 + Math.cos(t) * 0.0005;

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();

  /* ================= RESIZE ================= */

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  /* ================= CLEANUP ================= */

  return () => {
    cancelAnimationFrame(animationId);
    ScrollTrigger.getAll().forEach(t => t.kill());
    renderer.dispose();
    window.removeEventListener("resize", onResize);
  };
}