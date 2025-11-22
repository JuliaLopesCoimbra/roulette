"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  OrthographicCamera,
  OrbitControls,
  Preload,
} from "@react-three/drei";
import { motion } from "framer-motion";
import prizeImages from "../../../../components/prizes/prizes";
import { getUserToken } from "../../../../utils/auth";

// =============== PARAMS ===============
const MODEL_URL = "/roleta-animacoes.glb";
const SPIN_SECONDS = 4.8;
const EXTRA_LOOPS = 4;
const ROT_OFFSET_DEG = 0;
const SECTOR_CENTER = 0.5;

// =============== UTILS 3D ===============
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

// =============== WHEEL MODEL ===============
function WheelModel({
  playTrigger,
  targetMark,
  marksCount,
  extraLoops,
  spinSeconds,
  rotationOffsetDeg,
  onFinish,
  onReady,
  reverseDirection = true,
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
  const holdTimeRef = useRef(null);

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

    onReady?.();
  }, [animations, actions, mixer, invalidate, onReady]);

  useEffect(() => {
    if (!playTrigger) return;
    const clip = clipRef.current;
    if (!clip) return;
    if (!marksCount) return;

    if (processedTriggerRef.current === playTrigger) return;
    processedTriggerRef.current = playTrigger;

    // ajuste mark alvo
    const offsetMarks = (rotationOffsetDeg / 360) * marksCount;
    const idxAdjFloat = targetMark + offsetMarks;
    const idxAdj = ((idxAdjFloat % marksCount) + marksCount) % marksCount;

    const targetTimeInClip =
      ((idxAdj + SECTOR_CENTER) / marksCount) * clip.duration;

    const totalCyclesTime = (extraLoops || 0) * clip.duration;
    const reverseTarget =
      (clip.duration - (targetTimeInClip % clip.duration)) % clip.duration;
    const finalTime = reverseDirection
      ? -(totalCyclesTime + reverseTarget)
      : totalCyclesTime + targetTimeInClip;

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
  }, [
    playTrigger,
    targetMark,
    marksCount,
    rotationOffsetDeg,
    extraLoops,
    clock,
    invalidate,
  ]);

  useFrame(() => {
    if (!spinningRef.current || !actionRef.current || !clipRef.current) return;
    const now = clock.getElapsedTime();
    const t = Math.min(1, (now - startTimeRef.current) / (spinSeconds || SPIN_SECONDS));
    const eased = easeOutCubic(t);

    const currentAggTime =
      fromTimeRef.current + (finalTimeRef.current - fromTimeRef.current) * eased;

    const clipDur = clipRef.current.duration || 1e-6;
    const timeInClip = reverseDirection
      ? ((currentAggTime % clipDur) + clipDur) % clipDur
      : currentAggTime % clipDur;

    actionRef.current.time = timeInClip;
    mixer.update(0);
    invalidate();

    if (t >= 1) {
      spinningRef.current = false;
      const hold = targetTimeInClipRef.current % clipDur;
      holdTimeRef.current = hold;
      actionRef.current.time = hold;
      actionRef.current.paused = true;
      mixer.update(0);
      invalidate();
      onFinish?.();
    }
  });

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

// =============== PÁGINA ===============
const STATUS_LABELS = {
  reserved: "Reservado",
  redeemed: "Retirado",
  canceled: "Cancelado",
};

export default function Roulette3D() {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]); //  vindo do back
  const [prizesLoading, setPrizesLoading] = useState(true);
  const [prizesError, setPrizesError] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prizeWon, setPrizeWon] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adClosable, setAdClosable] = useState(false);
  const [adShownForThisPrize, setAdShownForThisPrize] = useState(false);
  const [showOfferButton, setShowOfferButton] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [targetMark, setTargetMark] = useState(0);
  const [pendingPrize, setPendingPrize] = useState(null);       // objeto do prêmio
  const [pendingSectorIndex, setPendingSectorIndex] = useState(null); // índice no prizeImages

  const marksCount = prizeImages.length;

  // carregar prêmios da roleta 5
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
      return;
    }

    setPrizesLoading(true);
    setPrizesError(null);

    import("../../../../utils/api")
      .then(({ api }) => api.roulettePrizes(5))
      .then((data) => {
        const mapped = (data || []).map((item) => {
          const prize = item.prize || {};
          const brandName = mapPrizeNameToBrand(prize.name_prize);

          const local = prizeImages.find((p) => p.name === brandName);

          return {
            roulette_id: item.roulette_id,
            prize_id: prize.prize_ID,
            name_prize: brandName,           // agora casa com prizeImages
            raw_name: prize.name_prize,      // opcional: nome original do back
            attributes: prize.attributes || null,
            image: local?.image || "/img/prizes/default.png",
          };
        });

        setPrizes(mapped);
      })


      .catch((err) => {
        console.error("Erro ao carregar prizes da roleta:", err);
        setPrizesError(
          err?.message || "Não foi possível carregar os prêmios da roleta."
        );
      })
      .finally(() => {
        setPrizesLoading(false);
      });
  }, [router]);

  // anúncio: contagem e CTA
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

  const handleSpin = () => {
    if (!modelReady || isSpinning || loading || !marksCount) return;

    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
      return;
    }

    setIsSpinning(true);
    setLoading(true);

    import("../../../../utils/api")
      .then(({ api }) =>
        api.spin({
          roulette_id: "5",
          campaign_id: "1",
          ip_address: "200.200.1.1", // se quiser melhorar depois, beleza
        })
      )
      .then((spin) => {
        // spin: { spin_id, roulette_id, rouletteprize_id, prize_id, result, ... }

        if (spin.result !== "win" || !spin.prize_id) {
          console.warn("Spin não vencedor ou sem prize_id:", spin);

          const loseBrand = "Não foi dessa vez";
          const loseImage =
            prizeImages.find((p) => p.name === loseBrand)?.image ||
            "/img/prizes/default.png";

          // setor de "não foi dessa vez"
          const loseSectorIndex = prizeImages.findIndex(
            (p) => p.name === loseBrand
          );

          setPendingPrize({
            prize_id: null,
            name_prize: loseBrand,
            image: loseImage,
          });
          setPendingSectorIndex(loseSectorIndex === -1 ? 0 : loseSectorIndex);
          setTargetMark(loseSectorIndex === -1 ? 0 : loseSectorIndex);
          setPlayTrigger((n) => n + 1);
          return;
        }

        // 1) achar o PRÊMIO lógico pelo prize_id
        const matchedPrize = prizes.find(
          (p) => String(p.prize_id) === String(spin.prize_id)
        );

        if (!matchedPrize) {
          console.warn("Não encontrei prize pelo prize_id, fallback:", spin);

          // fallback: usa setor 0
          setPendingPrize({
            prize_id: spin.prize_id,
            name_prize: "Prêmio surpresa",
            image: "/img/prizes/default.png",
          });
          setPendingSectorIndex(0);
          setTargetMark(0);
          setPlayTrigger((n) => n + 1);
          return;
        }

        // 2) descobrir em qual setor está esse prêmio (pelo nome normalizado)
        const sectorIndex = prizeImages.findIndex(
          (img) => img.name === matchedPrize.name_prize
        );

        const finalSectorIndex = sectorIndex === -1 ? 0 : sectorIndex;

        // 3) guardar prêmio + setor
        setPendingPrize(matchedPrize);
        setPendingSectorIndex(finalSectorIndex);

        // 4) mandar setor para a roleta girar
        setTargetMark(finalSectorIndex);
        setPlayTrigger((n) => n + 1);
      })
      .catch((err) => {
        console.error("Erro ao girar roleta:", err);
        setIsSpinning(false);
        setLoading(false);
        alert(err?.message || "Erro ao tentar girar a roleta.");
      });
  };

  const onSpinFinish = () => {
    setIsSpinning(false);
    setLoading(false);

    if (!pendingPrize) {
      console.warn("onSpinFinish chamado sem pendingPrize");
      return;
    }

    console.log("prêmio que realmente caiu:", pendingPrize);
    setPrizeWon(pendingPrize);
    setAdShownForThisPrize(false);
    setShowModal(true);
  };


  const openAdOnce = () => {
    if (!adShownForThisPrize) {
      setAdShownForThisPrize(true);
      setShowAdModal(true);
    }
  };

  function mapPrizeNameToBrand(prizeName) {
    const n = (prizeName || "").toLowerCase();

    if (n.includes("mov")) return "Movida";
    if (n.includes("vivo")) return "Vivo";
    if (n.includes("bud")) return "Budweiser";
    if (n.includes("globo")) return "Não foi dessa vez"; // Globoplay -> "não foi dessa vez"
    if (n.includes("baudu")) return "Bauducco";
    if (n.includes("tri")) return "Trident";
    if (n.includes("super")) return "Superbet";
    if (n.includes("kitkat")) return "Kitkat";
    if (n.includes("coca")) return "Coca-Cola";
    if (n.includes("hell")) return "Hellmann's";

    return prizeName || "Prêmio";
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen z-20"
         style={{
        background: `
    radial-gradient(circle at top left, rgba(255,0,102,0.7), transparent 60%),
    radial-gradient(circle at bottom right, rgba(255,90,150,0.75), transparent 60%),
    linear-gradient(135deg, #ff0059 0%, #fb4668 60%)
  `
      }}
    >
      <motion.div {...fadeIn(0)}>
        {/* Mensagem de erro de prizes */}
        {prizesError && (
          <p className="mb-4 text-sm text-red-300 text-center">
            {prizesError}
          </p>
        )}

        {/* Container da roleta */}
        <div className="relative flex flex-col items-center w-[55vh]">
          <img
            src="/img/roulette/ponteiro.svg"
            alt="Ponteiro"
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-[30] w-[68px] pointer-events-none select-none"
          />

          <div className="w-[55vh] h-[55vh]">
            {marksCount > 0 && (
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
                    reverseDirection={true}
                  />
                  <Preload all />
                </Suspense>

                <UseOrthoSync />
                <OrthographicCamera
                  makeDefault
                  zoom={4}
                  position={[0, 0, 30]}
                />
                <ControlsFrontLocked />

                <ambientLight intensity={1.5} />
                <directionalLight intensity={1} position={[10, 10, 10]} />
              </Canvas>
            )}
          </div>
        </div>

        {/* Botão girar */}
        <div className="w-full flex justify-center mt-6">
      <button
  onClick={handleSpin}
  disabled={!modelReady || isSpinning || loading || !marksCount}
  className={`
    relative select-none tracking-wide font-semibold
    px-10 py-4 rounded-xl text-xl
    text-white
    bg-gradient-to-b from-[#ff4b6e] to-[#ff1f5a]
    shadow-[0_0_25px_rgba(255,20,70,0.8),0_0_45px_rgba(255,70,120,0.6)]
    border border-white/20
    transition-all duration-200
    ${isSpinning || loading ? "" : "hover:scale-110 hover:shadow-[0_0_35px_rgba(255,40,90,0.9),0_0_60px_rgba(255,90,130,0.8)]"}
    disabled:opacity-30 disabled:cursor-not-allowed
  `}
>
  <span className="relative z-10 drop-shadow-[0_0_6px_black]">
    {isSpinning ? "Girando..." : loading ? "Buscando..." : "GIRAR AGORA"}
  </span>

  {/* Glow pulsante */}
  <span className="absolute inset-0 rounded-xl bg-[#ff1f5a] blur-xl opacity-50 animate-pulse pointer-events-none"></span>
</button>

        </div>

        {/* Modal de prêmio */}
      {showModal && prizeWon && (
  <div
    className="
      fixed inset-0 z-50
      flex items-center justify-center
      px-4
      bg-black/70 backdrop-blur-sm
    "
    onClick={() => {
      // Ao fechar no backdrop, já dispara o fluxo do anúncio
      openAdOnce();
    }}
  >
    {/* Fundo decorativo suave */}
    <div
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        background: `
          radial-gradient(800px 600px at 50% 0%, rgba(255,182,193,0.32), transparent 70%),
          radial-gradient(900px 900px at 50% 100%, rgba(251,70,103,0.25), transparent 70%)
        `,
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()} // Não dispara o anúncio ao clicar dentro
      className="
        relative w-full max-w-md
        rounded-3xl
        border border-white/25
        bg-white/90
        shadow-[0_18px_60px_rgba(0,0,0,0.55)]
        px-6 pt-5 pb-6
        text-center
      "
      style={{
        backdropFilter: "blur(18px)",
      }}
    >
      {/* Badge topo + botão fechar discreto */}
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fb4667]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#fb4667]" />
          Resultado
        </span>

        <button
          onClick={() => {
            setShowModal(false);
            openAdOnce();
          }}
          className="text-xs text-gray-500 hover:text-gray-700 transition"
        >
          Fechar
        </button>
      </div>

      {String(prizeWon.name_prize || "").toLowerCase().includes("não foi dessa vez") ? (
        <>
          {/* Ícone / Emoji de “não foi dessa vez” */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-100 shadow-inner">
            <span className="text-3xl">😢</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Não foi dessa vez
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Mas não desanima! Volte mais tarde e tente a sorte novamente. ✨
          </p>

          <button
            onClick={() => {
              setShowModal(false);
              openAdOnce();
            }}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-black transition"
          >
            Entendi
          </button>
        </>
      ) : (
        <>
          {/* Coroa / selo de vencedor */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9bb4] to-[#fb4667] shadow-[0_0_24px_rgba(251,70,103,0.5)]">
            <span className="text-3xl drop-shadow-sm">🎉</span>
          </div>

          <h2 className="text-2xl font-bold text-[#fb4667]">
            Parabéns!
          </h2>
          <p className="mt-1 text-sm text-gray-800">
            Você ganhou um voucher de:
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {prizeWon.name_prize}
          </p>

          {/* Imagem do prêmio com moldura */}
          <div className="mt-4 flex justify-center">
            <div className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffe4ec] to-[#ffd4de] p-[2px]">
              <div className="rounded-2xl bg-white px-4 py-3">
                <img
                  src={prizeWon.image}
                  alt={prizeWon.name_prize}
                  className="h-20 w-20 object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            Apresente seu voucher no ponto de troca oficial para retirar o brinde.
          </p>

          <button
            onClick={() => {
              setShowModal(false);
              openAdOnce();
            }}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#fb4667] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(251,70,103,0.55)] hover:brightness-110 transition"
          >
            Fechar e continuar
          </button>
        </>
      )}
    </motion.div>
  </div>
)}


        {/* Modal de anúncio */}
        {showAdModal && (
          <div
            className="
      fixed inset-0 z-[100]
      flex items-center justify-center
      bg-black/90
      overflow-hidden
    "
            style={{ touchAction: "none" }}
          >
            <div className="relative w-full h-[100dvh]">
              <img
                src="/img/bauducco.jpg"
                alt="Anúncio"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                onClick={(e) => {
                  if (adClosable) setShowAdModal(false);
                }}
                draggable={false}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (adClosable) setShowAdModal(false);
                }}
                className="
          fixed
          z-[110]
          text-white
          rounded-full px-3 py-1
          text-[3vh] leading-none
        "
                style={{
                  top: "calc(env(safe-area-inset-top, 0px) + 12px)",
                  right: "calc(env(safe-area-inset-right, 0px) + 12px)",
                }}
              >
                {adClosable ? "×" : adCountdown}
              </button>

              {showOfferButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="fixed left-1/2 -translate-x-1/2 z-[110]"
                  style={{
                    bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
                  }}
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
