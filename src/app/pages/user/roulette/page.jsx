"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrthographicCamera, OrbitControls, Preload } from "@react-three/drei";
import { motion } from "framer-motion";

// import DollarRain from "../../../../components/rainMoney/DollarRain"; // removido
import prizes from "../../../../components/prizes/prizes";
import { addBrindeHoje, canSpinByDailyLimit } from "../../../../utils/brindesStorage";

/* =================== PARAMS =================== */
const MODEL_URL = "/roleta-animacoes.glb";
const SPIN_SECONDS = 4.8; // duração total do giro
const EXTRA_LOOPS = 4;    // voltas completas antes de parar
const ROT_OFFSET_DEG = 0; // ajuste fino do zero, se precisar

/* =================== UTILS 3D =================== */
function UseOrthoSync() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (camera?.updateProjectionMatrix) camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function computeMeshesBox(root) {
  const box = new THREE.Box3();
  let hasAny = false;
  root.traverse((obj) => {
    if (obj?.isMesh && obj.visible !== false) {
      const b = new THREE.Box3().setFromObject(obj);
      if (!isFinite(b.min.x) || !isFinite(b.max.x)) return;
      if (!hasAny) {
        box.copy(b);
        hasAny = true;
      } else {
        box.union(b);
      }
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

    if (camera?.isOrthographicCamera) {
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
  if (!clip?.tracks?.length) return 30;
  const dts = [];
  clip.tracks.forEach((t) => {
    const times = t.times;
    if (!times || times.length < 2) return;
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
  onFinish, // chamado ao terminar o giro
  onReady,  // chamado quando o modelo/clip está pronto
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
  const holdTimeRef = useRef(null); // ✅ tempo "congelado" após pouso

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o?.isMesh) {
        o.frustumCulled = false;
        if (o.material) o.material.side = THREE.DoubleSide;
      }
    });
    gl?.info?.reset?.();
    scene.updateMatrixWorld(true);
  }, [scene, gl]);

  // Inicializa a action quando as animações carregarem e sinaliza "pronto"
  useEffect(() => {
    const clip = animations && animations[0];
    if (!clip) return;

    clipRef.current = clip;
    const fps = estimateFpsFromTracks(clip);
    fpsRef.current = fps;
    totalFramesRef.current = Math.round(clip.duration * fps);

    const a = (actions && actions[clip.name]) || mixer.clipAction(clip);
    a.enabled = true;
    a.setLoop(THREE.LoopOnce);
    a.clampWhenFinished = true;
    a.paused = true;
    a.time = holdTimeRef.current ?? 0;
    mixer.update(0);
    actionRef.current = a;
    invalidate();

    onReady?.(); // ✅ agora o pai sabe que pode habilitar o botão "Gire"
  }, [animations, actions, mixer, invalidate, onReady]);

  // Dispara o giro quando playTrigger mudar (e o clip já existir)
  useEffect(() => {
    if (!playTrigger) return;

    const clip = clipRef.current;
    if (!clip) return; // não consome o trigger; aguarda o modelo

    if (processedTriggerRef.current === playTrigger) return;
    processedTriggerRef.current = playTrigger;

    // Ajuste para alinhar o mark ao ponteiro (meio setor)
    const offsetMarks = (rotationOffsetDeg / 360) * marksCount;
    const idxAdjFloat = targetMark + offsetMarks;
    const idxAdj = ((idxAdjFloat % marksCount) + marksCount) % marksCount;

    const framesPerMark = totalFramesRef.current / marksCount;
    // +0.5 centraliza no meio do setor
    const targetFrame = Math.round((idxAdj ) * framesPerMark) % totalFramesRef.current;
    const targetTimeInClip = targetFrame / fpsRef.current;

    const totalCyclesTime = (extraLoops || 0) * clip.duration;
    const finalTime = totalCyclesTime + targetTimeInClip;

    targetTimeInClipRef.current = targetTimeInClip;
    fromTimeRef.current = 0;
    finalTimeRef.current = finalTime;
    startTimeRef.current = clock.getElapsedTime();
    spinningRef.current = true;
    holdTimeRef.current = null;

    const a = actionRef.current;
    a.paused = true;
    a.play();
    mixer.update(0);
    invalidate();
  }, [playTrigger, targetMark, marksCount, rotationOffsetDeg, extraLoops, clock, invalidate]);

  // Avança o tempo da animação manualmente com easing e encerra no frame/tempo alvo
  useFrame(() => {
    if (!spinningRef.current || !actionRef.current || !clipRef.current) return;
    const now = clock.getElapsedTime();
    const t = Math.min(1, (now - startTimeRef.current) / (spinSeconds || SPIN_SECONDS));
    const eased = easeOutCubic(t);

    const currentAggTime =
      fromTimeRef.current + (finalTimeRef.current - fromTimeRef.current) * eased;

    const clipDur = clipRef.current.duration || 1e-6;
    const timeInClip = currentAggTime % clipDur;

    actionRef.current.time = timeInClip;
    mixer.update(0);
    invalidate();

    if (t >= 1) {
      spinningRef.current = false;

      // ✅ congele exatamente no tempo do prêmio
      const hold = targetTimeInClipRef.current % clipDur;
      holdTimeRef.current = hold;
      actionRef.current.time = hold;
      actionRef.current.paused = true;
      mixer.update(0);
      invalidate();

      onFinish?.();
    }
  });

  // (D) se houver qualquer re-render depois do pouso, reafirme o frame congelado
  useEffect(() => {
    if (!spinningRef.current && actionRef.current && holdTimeRef.current != null) {
      actionRef.current.time = holdTimeRef.current;
      actionRef.current.paused = true;
      mixer.update(0);
      invalidate();
    }
  });
  
  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
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
  const [modelReady, setModelReady] = useState(false);

  const [playTrigger, setPlayTrigger] = useState(0);
  const [targetMark, setTargetMark] = useState(0);
  const marksCount = prizes.length;
  const [pendingPrizeIndex, setPendingPrizeIndex] = useState(null);

  useEffect(() => {
    setLimitReached(!canSpinByDailyLimit());
  }, []);

  // Anúncio: cronômetro e CTA
  useEffect(() => {
    if (!showAdModal) return;
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
  }, [showAdModal]);

  useEffect(() => {
    if (!showAdModal) return;
    const t = setTimeout(() => setShowOfferButton(true), 2000);
    return () => clearTimeout(t);
  }, [showAdModal]);

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  const comeBack = () => router.push("/pages/user/dashboard");

  const handleSpin = () => {
    if (!modelReady || isSpinning || loading) return;

    // Se quiser habilitar as regras, descomente:
    // if (!canSpinByDailyLimit()) { setLimitReached(true); setShowCooldownMessage(true); return; }
    // const cooldownRaw = localStorage.getItem("roletaCooldown");
    // if (cooldownRaw && Number(cooldownRaw) > Date.now()) { setShowCooldownMessage(true); return; }

    setIsSpinning(true);
    setLoading(true);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    setPendingPrizeIndex(prizeIndex);
    setTargetMark(prizeIndex); // 1 setor = 1 prêmio → alinhamento garantido
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
    const isRetry =
      name.includes("tente de novo") ||
      name.includes("não foi dessa vez") ||
      name.includes("nao foi dessa vez");

    if (isRetry) {
      setHasSpun(false);
      setTimeout(() => setShowModal(true), 200);
      return;
    }

    // Salva brinde e aplica cooldown
    const res = addBrindeHoje(prize.name);
    if (!res.ok) {
      setLimitReached(true);
      setShowCooldownMessage(true);
      return;
    }

    setHasSpun(true);
    const expiration = Date.now() + 3 * 60 * 60 * 1000;
    localStorage.setItem("roletaCooldown", expiration.toString());

    setTimeout(() => setShowModal(true), 300);
    setTimeout(() => setShowCooldownMessage(true), 1200);
  };
const openAdOnce = () => {
  if (!adShownForThisPrize) {
    setAdShownForThisPrize(true);
    // abre já; se quiser delay, reintroduza o setTimeout
    setShowAdModal(true);
  }
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
        {/* Container da roleta com ponteiro fixo por cima */}
        <div className="relative flex flex-col items-center w-[55vh]">
          {/* Ponteiro (SVG) centralizado no topo */}
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
                  onReady={() => setModelReady(true)}
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
    !modelReady ||
    isSpinning ||
    loading ||
    (hasSpun &&
      prizeWon &&
      !(prizeWon.name || "").toLowerCase().includes("tente de novo") &&
      !(prizeWon.name || "").toLowerCase().includes("não foi dessa vez"))
  }
  className={`
    relative group px-8 py-3 rounded-full select-none tracking-wide font-semibold
    bg-gradient-to-r from-[#fb4667] to-[#c42441]
    text-[#ffeaf0] transition-all duration-300
    border border-[#ffffff20]
    shadow-[0_0_15px_rgba(251,70,103,0.55)] 
    backdrop-blur-xl

    ${isSpinning || loading ? "" : "hover:scale-[1.08] hover:rotate-[0.8deg]"}

    disabled:opacity-30 disabled:cursor-not-allowed disabled:saturate-0
  `}
>
  {/* texto */}
  <span className="relative z-20 drop-shadow-[0_0_4px_rgba(0,0,0,0.45)]">
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

  {/* glow principal */}
  <span className="absolute inset-0 rounded-full opacity-70 bg-gradient-to-r from-[#fb4667] to-[#ff6f88]
      blur-xl transition-transform duration-300 
      group-hover:scale-[1.35] group-hover:opacity-90 pointer-events-none">
  </span>

  {/* borda interna brilhante */}
  <span className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></span>
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

       {/* Modal de prêmio */}
{showModal && prizeWon && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    // 2) Qualquer clique no overlay já abre o anúncio
    onClick={openAdOnce}
  >
    {/* Fundo claro rosado */}
    <div
      className="absolute inset-0 backdrop-blur-md"
      style={{
        background: `
          radial-gradient(900px 600px at 50% 10%, rgba(255,182,193,0.38), transparent 70%),
          radial-gradient(1200px 900px at 50% 90%, rgba(251,70,103,0.18), transparent 70%),
          rgba(255,255,255,0.45)
        `,
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      // 3) Remova o stopPropagation e também chame openAdOnce aqui:
      onClick={openAdOnce}
      className="relative mx-auto w-[92vw] max-w-md rounded-2xl p-6 text-center border border-white/30 shadow-lg"
      style={{
        backdropFilter: "blur(14px)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,245,247,0.65))",
      }}
    >
      {(prizeWon.name || "").toLowerCase().includes("não foi dessa vez") ? (
        <>
          <h2 className="text-xl font-semibold text-[#fb4667]">Não foi dessa vez 😢</h2>
          <p className="mt-2 text-sm text-gray-700">Tente novamente mais tarde!</p>

          <button
            // Obs.: "qualquer lugar" abre o anúncio — inclusive botões.
            onClick={() => {
              setShowModal(false);
              openAdOnce();
            }}
            className="mt-6 px-6 py-2 rounded-full bg-[#fb4667] text-white hover:opacity-90 transition"
          >
            Fechar
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-[#fb4667]">🎉 Parabéns! 🎉</h2>

          <img
            src={prizeWon.image}
            alt={prizeWon.name}
            className="w-28 h-28 object-contain mx-auto my-4 drop-shadow-md"
          />

          <p className="text-gray-700">
            Você ganhou: <strong className="text-[#fb4667]">{prizeWon.name}</strong>
          </p>

          {/* Cupom */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <code className="px-4 py-2 rounded-lg bg-white text-[#fb4667] border border-[#fb4667]/30 tracking-wider font-semibold">
              NFS125
            </code>

            <button
              onClick={() => {
                navigator.clipboard?.writeText("NFS125");
                openAdOnce();
              }}
              className="px-3 py-2 rounded-lg text-sm bg-[#fb4667]/90 text-white hover:bg-[#fb4667] transition"
            >
              Copiar
            </button>
          </div>

          <button
            onClick={() => {
              setShowModal(false);
              openAdOnce();
            }}
            className="mt-6 px-6 py-2 rounded-full bg-[#fb4667] text-white hover:opacity-90 transition"
          >
            Fechar
          </button>
        </>
      )}
    </motion.div>
  </div>
)}


    {/* Modal de anúncio */}
{showAdModal && (
  // 4) Eleve o z-index pra ficar acima da modal de prêmio
  <div className="fixed inset-0 z-60 bg-black bg-opacity-90 flex items-center justify-center">
    <div className="relative w-screen h-screen overflow-hidden">
      <img src="/img/bauducco.jpg" alt="Anúncio" className="w-full h-full object-cover" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (adClosable) setShowAdModal(false);
        }}
        className="absolute top-4 right-4 text-white text-[3vh] z-10 rounded-full px-3 py-1"
      >
        {adClosable ? "×" : adCountdown}
      </button>

      {showOfferButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            onClick={() =>
              window.open(
                "https://www.lojabauducco.com.br/?utm_source=google&utm_medium=cpc&utm_campaign=bauducco_pmax_aquisicao_sp_conversao_compras",
                "_blank"
              )
            }
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 shadow-md transition"
          >
            Acessar Oferta
          </button>
        </motion.div>
      )}
    </div>
  </div>
)}

      </motion.div>
    </div>
  );
}

useGLTF.preload?.(MODEL_URL);
