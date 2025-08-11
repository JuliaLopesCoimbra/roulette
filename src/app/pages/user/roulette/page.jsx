"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import prizes from "../../../../components/prizes/prizes";
import { motion } from "framer-motion";
import DollarRain from "../../../../components/rainMoney/DollarRain";
import { addBrindeHoje, canSpinByDailyLimit } from "../../../../utils/brindesStorage";
export default function Roulette() {
  // const audioRef = useRef(null); // Referência do áudio
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
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
  const [showOfferButton, setShowOfferButton] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
   useEffect(() => {
    setLimitReached(!canSpinByDailyLimit());
  }, []);
  const handleSpin = () => {
  // Limite diário (conta qualquer prêmio, inclusive tente de novo)
  // if (!canSpinByDailyLimit()) {
  //   setLimitReached(true);
  //   setShowCooldownMessage(true);
  //   return;
  // }

  // Cooldown só se o último prêmio não foi "Tente de novo"
  // const cooldownRaw = localStorage.getItem("roletaCooldown");
  // if (cooldownRaw && Number(cooldownRaw) > Date.now()) {
  //   setShowCooldownMessage(true);
  //   return;
  // }

  setIsSpinning(true);
  setLoading(true);
  setRotation(0);

  setTimeout(() => {
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prizeAngle = 360 / prizes.length;
    const randomOffset = Math.floor(Math.random() * prizeAngle);
    const spins = 5;
    const correction = prizeAngle / 2;
    const totalRotation = -(spins * 360 + prizeIndex * prizeAngle + randomOffset - correction);
    setRotation(totalRotation);

   setTimeout(() => {
  setIsSpinning(false);
  setLoading(false);

  const prize = prizes[prizeIndex];
  console.log("Prêmio sorteado:", prize);
  setPrizeWon(prize);
  setAdShownForThisPrize(false);

  if (prize.name === "Tente de novo") {
    // ✅ NÃO salva, NÃO aplica cooldown, deixa girar novamente
    // (opcional) abrir modal só pra feedback
    setTimeout(() => setShowModal(true), 500);
    // não mexe em hasSpun / cooldown / limit
    return;
  }

  // ✅ Qualquer outro resultado: salva e aplica regras
  const res = addBrindeHoje(prize.name);
  if (!res.ok) {
    setLimitReached(true);
    setShowCooldownMessage(true);
    return;
  }

  setHasSpun(true);

  // cooldown 3h
  const expiration = Date.now() + 3 * 60 * 60 * 1000;
  localStorage.setItem("roletaCooldown", expiration.toString());

  setTimeout(() => setShowModal(true), 1500);
  setTimeout(() => setShowCooldownMessage(true), 5000);
}, 10000);


  }, 50);
};

  function toGoingSiteAd() {
    window.open("https://vittaresidencial.com.br", "_blank");
  }
  const comeBack = () => {
    // Redireciona para a página de dashboard
    router.push("/pages/user/dashboard");
  };
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });
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
    }
  }, [showAdModal]);
  useEffect(() => {
    if (showAdModal) {
      const timer = setTimeout(() => {
        setShowOfferButton(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAdModal]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen  z-20"
      style={{
        background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 100%)"
      }}
    >
      <motion.div
        {...fadeIn(0)}

      >
        <DollarRain />
        {/* <audio ref={audioRef} src="/sound/roleta.mp3" preload="auto" /> */}
        <div className="relative flex justify-center items-center w-[55vh] h-[55vh] m-0">

          <img
            src="/img/roulette/roleta.png"
            alt="Roleta"
            className={`absolute top-0 left-0 z-[1] w-full h-full transition-transform duration-[10000ms] [transition-timing-function:cubic-bezier(0.1,1,0.3,1)]
    ${isSpinning ? 'filter blur-[1.6px] drop-shadow-[0_0_30px_rgba(139,92,246,0.7)]' : 'transition-none'}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          />


          {/* Fotoborda – fixo por cima da roleta */}
          <img
            src="/img/roulette/borda.png"
            alt="Borda decorativa"
            className="absolute top-0 left-0 z-[2] w-full h-full pointer-events-none"
          />

          {/* Ponteiro – fixo no topo */}
          <img
            src="/img/roulette/ponteiro.png"
            alt="Ponteiro"
            className="absolute top-0 left-1/2 z-[3] w-[12%] translate-x-[-50%]"
          />


          <button
            onClick={handleSpin}
            disabled={
              isSpinning ||
              loading ||
              (hasSpun && prizeWon?.name !== "Tente de novo")
            }
            className={`
    absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]
    w-[12vh] h-[12vh] bg-yellow-600 text-white rounded-full
    hover:bg-yellow-700 animate-shine button-glow
    z-[10] tracking-wider transition-opacity duration-300
    flex items-center justify-center text-center text-[3vh]
    ${isSpinning || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
              }
    ${(hasSpun && prizeWon?.name !== "Tente de novo")
                ? " cursor-not-allowed"
                : "hover:scale-105"
              }
  `}

          >
            {isSpinning
              ? ""
              : loading
                ? "Buscando..."
                : hasSpun && prizeWon?.name === "Tente de novo"
                  ? "Tente de novo"
                  : "Gire"}
          </button>


        </div>

        {hasSpun && showCooldownMessage && (
          <>
            <div className="relative justify-center items-center text-center w-[55vh] ">
              <p className="mt-16 text-lg z-10  ">
                Você pode tentar novamente em 3 horas
              </p>
              <button
                onClick={() => comeBack()}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow-md transition"
              >
                Voltar
              </button>
            </div>
          </>
        )}


        {showModal && prizeWon && (
          <div className="fixed inset-0 z-50  bg-opacity-60 flex items-center justify-center"
            onClick={() => {
              if (!adShownForThisPrize) {
                setAdShownForThisPrize(true); // marca que já mostrou o anúncio
                setTimeout(() => setShowAdModal(true), 300);
              }
            }}
          >
            <motion.div

              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800  rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md text-center animate-pop relative"
              style={{
                boxShadow: `
                                inset 0 0 14px rgba(43, 43, 43, 2),
                                0 9px 100px rgba(22, 22, 22, 2)
                              `
                ,
                background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 80%)"

              }}

            >
              {prizeWon.name === "Não foi dessa vez" ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-red-500 drop-shadow-md">
                    Infelizmente não foi dessa vez
                  </h2>
                  <p className="text-md mb-6 text-gray-300">
                    Mas não desanime, você pode tentar mais tarde!
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-yellow-400 drop-shadow-glow">
                    Parabéns!
                  </h2>
                  <img
                    src={prizeWon.image}
                    alt={prizeWon.name}
                    className="w-32 h-32 object-contain mx-auto mb-4 rounded-xl  shadow-lg"
                  />
                  <p className="text-lg mb-6 text-white">
                    Você ganhou um cupom de <strong className="text-yellow-500">{prizeWon.name}</strong> para usar nas suas compras
                  </p>
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <p className="text-sm text-gray-100">
                      Use o código no carrinho para aplicar o desconto!
                    </p>
                    <button className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-600 hover:text-white transition">
                      NFS125
                    </button>
                  </div>
                </>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="mt-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-full shadow-md transition-all"
              >
                Fechar
              </button>
            </motion.div>

          </div>
        )}

        {showAdModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="relative w-screen h-screen overflow-hidden">

              {/* Imagem do anúncio */}
              <img
                src="/img/vittaAd.jpeg"
                alt="Anúncio"
                className="w-full h-full object-cover"
              />

              {/* Botão Fechar no canto superior direito */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (adClosable) setShowAdModal(false);
                }}
                className="absolute top-4 right-4 text-white text-[3vh] z-10  rounded-full px-3 py-1"
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
                    onClick={() => toGoingSiteAd()}
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


