"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrthographicCamera, OrbitControls, Preload } from "@react-three/drei";
import { motion } from "framer-motion";

import prizes from "../../../../components/prizes/prizes";
import { addBrindeHoje, canSpinByDailyLimit } from "../../../../utils/brindesStorage";

/* =================== PARAMS =================== */
const MODEL_URL = "/roleta-animacoes.glb";
const SPIN_SECONDS = 4.8;
const EXTRA_LOOPS = 4;
/* Ajuste fino de alinhamento caso o “zero” do GLB não esteja exatamente no topo.
   Para 10 fatias, cada fatia = 36°. Teste valores múltiplos (ex.: 0, 36, -36, 72...). */
const ROT_OFFSET_DEG = 0;

/* =================== UTILS 3D =================== */
function UseOrthoSync() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    camera && camera.updateProjectionMatrix && camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function computeMeshesBox(root) {
  const box = new THREE.Box3(); let hasAny = false;
  root.traverse((obj) => {
    if (obj && obj.isMesh && obj.visible !== false) {
      const b = new THREE.Box3().setFromObject(obj);
      if (!isFinite(b.min.x) || !isFinite(b.max.x)) return;
      if (!hasAny) { box.copy(b); hasAny = true; } else { box.union(b); }
    }
  });
  return hasAny ? box : new THREE.Box3().setFromObject(root);
}

function CenterAndFit({ groupRef }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (!groupRef.current) return;
    const box = computeMeshesBox(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const sizeBox = box.getSize(new THREE.Vector3());

    groupRef.current.position.sub(center);

    const margin = 1.1;
    const zoomX = size.width / (sizeBox.x * margin);
    const zoomY = size.height / (sizeBox.y * margin);
    const newZoom = Math.max(0.01, Math.min(zoomX, zoomY));

    if (camera && camera.isOrthographicCamera) {
      camera.zoom = newZoom;
      camera.position.set(0, 0, 30);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    }
    invalidate();
  }, [camera, size, invalidate, groupRef]);
  return null;
}

function ControlsFrontLocked() {
  const controlsRef = useRef(null);
  const { camera, invalidate } = useThree();
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate]);
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minPolarAngle={Math.PI / 2 - 0.15}
      maxPolarAngle={Math.PI / 2 + 0.15}
      minAzimuthAngle={-0.6}
      maxAzimuthAngle={0.6}
      enableDamping
      dampingFactor={0.08}
      minZoom={0.6}
      maxZoom={12}
    />
  );
}

function estimateFpsFromTracks(clip) {
  if (!clip || !clip.tracks || !clip.tracks.length) return 30;
  const dts = [];
  clip.tracks.forEach((t) => {
    const times = t.times; if (!times || times.length < 2) return;
    for (let i = 1; i < times.length; i++) {
      const dt = times[i] - times[i - 1];
      if (dt > 0 && isFinite(dt)) dts.push(dt);
    }
  });
  if (!dts.length) return 30;
  dts.sort((a, b) => a - b);
  const m = Math.floor(dts.length / 2);
  const med = dts.length % 2 ? dts[m] : (dts[m - 1] + dts[m]) / 2;
  return Math.round(1 / med);
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* =================== WHEEL MODEL =================== */
function WheelModel({
  playTrigger,
  targetMark,
  marksCount,
  extraLoops,
  spinSeconds,
  rotationOffsetDeg,
  onFinish,
}) {
  const groupRef = useRef(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, mixer } = useAnimations(animations, scene);
  const { invalidate, gl, clock } = useThree();

  const clipRef = useRef(null);
  const fpsRef = useRef(60);
  const totalFramesRef = useRef(300);

  const spinningRef = useRef(false);
  const startTimeRef = useRef(0);
  const fromTimeRef = useRef(0);
  const finalTimeRef = useRef(0);
  const targetTimeInClipRef = useRef(0);
  const actionRef = useRef(null);
  const processedTriggerRef = useRef(0);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o && o.isMesh) {
        o.frustumCulled = false;
        if (o.material) o.material.side = THREE.DoubleSide;
      }
    });
    gl?.info?.reset?.();
    scene.updateMatrixWorld(true);
  }, [scene, gl]);

  useEffect(() => {
    const clip = animations && animations[0];
    if (!clip) return;

    clipRef.current = clip;
    const fps = estimateFpsFromTracks(clip);
    fpsRef.current = fps;
    totalFramesRef.current = Math.round(clip.duration * fps);

    const actionName = clip.name;
    const a = (actions && actions[actionName]) || mixer.clipAction(clip);
    a.enabled = true;
    a.setLoop(THREE.LoopOnce);
    a.clampWhenFinished = true;
    a.paused = true;
    a.time = 0;
    mixer.update(0);
    actionRef.current = a;
    invalidate();
  }, [animations, actions, mixer, invalidate]);

  // ====== CÁLCULO DO ALVO AJUSTADO + FRAME CENTRAL DA FATIA ======
  useEffect(() => {
    if (!playTrigger || processedTriggerRef.current === playTrigger) return;
    processedTriggerRef.current = playTrigger;

    const clip = clipRef.current; if (!clip) return;

    // offset em “fatias”
    const offsetMarks = (rotationOffsetDeg / 360) * marksCount;
    const idxAdjFloat = targetMark + offsetMarks;
    const idxAdj = ((idxAdjFloat % marksCount) + marksCount) % marksCount;

    const framesPerMark = totalFramesRef.current / marksCount;
    // usa o CENTRO da fatia para parar exatamente no meio do ponteiro (12h)
    const targetFrame = Math.round((idxAdj + 0.5) * framesPerMark) % totalFramesRef.current;
    const targetTimeInClip = targetFrame / fpsRef.current;

    const totalCyclesTime = extraLoops * clip.duration;
    const finalTime = totalCyclesTime + targetTimeInClip;

    targetTimeInClipRef.current = targetTimeInClip;
    fromTimeRef.current = 0;
    finalTimeRef.current = finalTime;
    startTimeRef.current = clock.getElapsedTime();
    spinningRef.current = true;

    const a = actionRef.current;
    a.paused = true;
    a.play();
    mixer.update(0);
    invalidate();
  }, [playTrigger, targetMark, marksCount, rotationOffsetDeg, extraLoops, clock, mixer, invalidate]);

  // ====== ANIMAÇÃO COM SNAP FINAL EXATO ======
  useFrame(() => {
    if (!spinningRef.current || !actionRef.current || !clipRef.current) return;
    const now = clock.getElapsedTime();
    const t = Math.min(1, (now - startTimeRef.current) / SPIN_SECONDS);
    const eased = easeOutCubic(t);

    const currentAggTime = fromTimeRef.current + (finalTimeRef.current - fromTimeRef.current) * eased;
    const clipDur = clipRef.current.duration || 1e-6;
    const timeInClip = currentAggTime % clipDur;

    actionRef.current.time = timeInClip;
    mixer.update(0);
    invalidate();

    if (t >= 1) {
      spinningRef.current = false;
      const snapTime = targetTimeInClipRef.current % clipDur;
      actionRef.current.time = snapTime;
      actionRef.current.paused = true;
      mixer.update(0);
      invalidate();
      onFinish?.();
    }
  });

  return (
    <>
      <group ref={groupRef}><primitive object={scene} /></group>
      <CenterAndFit groupRef={groupRef} />
    </>
  );
}

/* =================== PÁGINA / INTEGRAÇÃO =================== */
export default function Roulette3D() {
  const router = useRouter();

  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prizeWon, setPrizeWon] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adClosable, setAdClosable] = useState(false);
  const [adShownForThisPrize, setAdShownForThisPrize] = useState(false);
  const [showCooldownMessage, setShowCooldownMessage] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [showOfferButton, setShowOfferButton] = useState(false);

  const [playTrigger, setPlayTrigger] = useState(0);
  const [targetMark, setTargetMark] = useState(0);
  const marksCount = prizes.length;
  const [pendingPrizeIndex, setPendingPrizeIndex] = useState(null);

  useEffect(() => {
    setLimitReached(!canSpinByDailyLimit());
  }, []);

  useEffect(() => {
    if (showAdModal) {
      setAdCountdown(5);
      setAdClosable(false);
      const interval = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setAdClosable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showAdModal]);

  useEffect(() => {
    if (showAdModal) {
      const t = setTimeout(() => setShowOfferButton(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showAdModal]);

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  const comeBack = () => router.push("/pages/user/dashboard");

  const handleSpin = () => {
    setIsSpinning(true);
    setLoading(true);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    setPendingPrizeIndex(prizeIndex);
    setTargetMark(prizeIndex);
    setPlayTrigger((n) => n + 1);
  };

  const onSpinFinish = () => {
    setIsSpinning(false);
    setLoading(false);
    if (pendingPrizeIndex == null) return;

    const prize = prizes[pendingPrizeIndex];
    setPrizeWon(prize);
    setAdShownForThisPrize(false);

    const name = (prize.name || "").toLowerCase();
    const isRetry = name.includes("tente de novo") || name.includes("não foi dessa vez") || name.includes("nao foi dessa vez");

    if (isRetry) {
      setHasSpun(false);
      setTimeout(() => setShowModal(true), 500);
      return;
    }

    const res = addBrindeHoje(prize.name);
    if (!res.ok) {
      setLimitReached(true);
      setShowCooldownMessage(true);
      return;
    }

    setHasSpun(true);
    const expiration = Date.now() + 3 * 60 * 60 * 1000;
    localStorage.setItem("roletaCooldown", expiration.toString());

    setTimeout(() => setShowModal(true), 600);
    setTimeout(() => setShowCooldownMessage(true), 3000);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen z-20"
      style={{
        background: `
          radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
          radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
          radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
          #000000
        `,
      }}
    >
      <motion.div {...fadeIn(0)}>

        {/* Ponteiro fixo no topo (12h) */}
        <div className="relative flex flex-col items-center w-[55vh]">
          <img
            src="/img/roulette/ponteiro.svg"
            alt="Ponteiro"
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-[30] w-[68px] pointer-events-none select-none"
          />

          <div className="w-[55vh] h-[55vh]">
            <Canvas dpr={[1, 2]} shadows>
              <Suspense fallback={null}>
                <WheelModel
                  playTrigger={playTrigger}
                  targetMark={targetMark}
                  marksCount={marksCount}
                  extraLoops={EXTRA_LOOPS}
                  spinSeconds={SPIN_SECONDS}
                  rotationOffsetDeg={ROT_OFFSET_DEG}
                  onFinish={onSpinFinish}
                />
                <Preload all />
              </Suspense>

              <UseOrthoSync />
              <OrthographicCamera makeDefault zoom={4} position={[0, 0, 30]} />
              <ControlsFrontLocked />

              <ambientLight intensity={1.5} />
              <directionalLight intensity={1} position={[10, 10, 10]} />
            </Canvas>
          </div>
        </div>

        {/* Botão abaixo da roleta */}
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={handleSpin}
            disabled={
              isSpinning ||
              loading ||
              (hasSpun &&
                prizeWon &&
                !(prizeWon.name || "").toLowerCase().includes("tente de novo") &&
                !(prizeWon.name || "").toLowerCase().includes("não foi dessa vez"))
            }
            className={`
              relative px-7 py-3 rounded-full select-none font-semibold tracking-wide
              text-white transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isSpinning || loading ? "" : "hover:scale-[1.06]"}
              bg-gradient-to-r from-[#ff6f88] to-[#fb4667]
              shadow-[0_0_25px_rgba(251,70,103,0.6)]
              border border-[#fb4667]/20
              backdrop-blur-xl
            `}
          >
            <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {isSpinning
                ? "Girando..."
                : loading
                ? "Buscando..."
                : hasSpun &&
                  prizeWon &&
                  ((prizeWon.name || "").toLowerCase().includes("tente de novo") ||
                   (prizeWon.name || "").toLowerCase().includes("não foi dessa vez"))
                ? "Tente de novo"
                : "Gire"}
            </span>
            <span className="absolute inset-0 rounded-full blur-xl opacity-60 bg-[#fb4667] animate-pulse pointer-events-none"></span>
          </button>
        </div>

        {hasSpun && showCooldownMessage && (
          <div className="relative justify-center items-center text-center w-[55vh]">
            <p className="mt-16 text-lg z-10">Você pode tentar novamente em 3 horas</p>
            <button
              onClick={() => router.push("/pages/user/dashboard")}
              className="mt-2 px-4 py-2 bg-[#fb4667] text-white rounded hover:bg-[#ff1d46] shadow-md transition"
            >
              Voltar
            </button>
          </div>
        )}

      {showAdModal && (
  <div className="fixed inset-0 z-50">
    {/* Backdrop com gradientes do tema */}
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(1200px 900px at 15% 15%, rgba(251,70,103,0.16), transparent 60%),
          radial-gradient(1000px 700px at 85% 25%, rgba(251,70,103,0.12), transparent 60%)
        `,
      }}
    />

    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      <img
        src="/img/bauducco.jpg"
        alt="Anúncio"
        className="w-full h-full object-cover opacity-90"
      />

      {/* Chip do countdown / fechar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (adClosable) setShowAdModal(false);
        }}
        className={`
          absolute top-5 right-5 rounded-full px-4 py-1.5 text-sm
          border border-white/15 backdrop-blur-md
          ${adClosable
            ? "bg-white/15 text-white hover:bg-white/20"
            : "bg-black/40 text-white/80 cursor-default"}
        `}
      >
        {adClosable ? "Fechar" : `${adCountdown}s`}
      </button>

      {/* CTA minimalista */}
      {showOfferButton && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={() =>
            window.open(
              "https://www.lojabauducco.com.br/?utm_source=google&utm_medium=cpc&utm_campaign=bauducco_pmax_aquisicao_sp_conversao_compras",
              "_blank"
            )
          }
          className="absolute bottom-8 left-1/2 -translate-x-1/2
                     px-6 py-3 rounded-full font-medium
                     bg-gradient-to-r from-[#ff6f88] to-[#fb4667]
                     text-white shadow-[0_0_22px_rgba(251,70,103,0.5)]
                     hover:opacity-95 transition"
        >
          Acessar oferta
        </motion.button>
      )}
    </div>
  </div>
)}


      </motion.div>
    </div>
  );
}

useGLTF.preload && useGLTF.preload(MODEL_URL);
