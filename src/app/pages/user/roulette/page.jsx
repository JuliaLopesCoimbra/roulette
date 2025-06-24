"use client";
import React, { useState, useRef, useEffect } from "react";
import prizes from "@/app/components/prizes/prizes";
import DollarRain from "@/app/components/rainMoney/DollarRain";

export default function Roleta() {
  const audioRef = useRef(null); // Referência do áudio
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

  const handleSpin = () => {
    setIsSpinning(true);
    setLoading(true);

    // Reproduz o som da roleta
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reinicia do começo
      audioRef.current.play();
    }

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prizeAngle = 360 / prizes.length;


    const randomOffset = Math.floor(Math.random() * prizeAngle); // para não ficar exato no centro

    const spins = 5; // número de voltas completas
    const totalRotation = -(spins * 360 + prizeIndex * prizeAngle + randomOffset);


    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setLoading(false);
      const prize = prizes[prizeIndex];
      console.log("Prêmio sorteado:", prize);
      setPrizeWon(prize);
      setAdShownForThisPrize(false); // libera nova exibição do anúncio

      // Só considera como "giro válido" se não for "Tente de novo"
      if (prize.name !== "Tente de novo") {
        setHasSpun(true);

        // Salva tempo de bloqueio por 3 horas
        const expiration = Date.now() + 3 * 60 * 60 * 1000;
        localStorage.setItem("roletaCooldown", expiration.toString());

         // Aguarda mais 3 segundos para exibir a modal
    setTimeout(() => {
      setShowModal(true);
    }, 1500);
      }
    }, 3000);

  };
  function toGoingSiteAd() {
    window.open("https://www.americanas.com.br/", "_blank");
  }
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

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0] z-20"
      style={{
  background: "radial-gradient(circle at center, #1a1a1a 0%, #0f0f0f 100%)",
}}

    >
      <DollarRain />
      <audio ref={audioRef} src="/sound/roleta.mp3" preload="auto" />
      
      <div
        className="mb-5 text-[40px] bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-shine"
        style={{ fontFamily: "'Bangers', cursive" }}
      >
        Teste sua sorte
      </div>

      <div className="relative flex justify-center items-center w-[55vh] h-[55vh] m-0">
        <img
          src={"/img/roleta.png"}
          alt="Roleta"
          className={` absolute top-0 z-[1] max-w-full max-h-full w-[55vh] h-[55vh] transition-transform duration-[3000ms] ease-out ${isSpinning ? "" : "transition-none "
            }`}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <img
          src={"/img/pointer.png"}
          alt="Ponteiro"
          className="absolute top-0 left-0 z-[2] w-full h-full"
        />
        <button
          onClick={handleSpin}
          disabled={
            isSpinning ||
            loading ||
            (hasSpun && prizeWon?.name !== "Tente de novo")
          }
          className={` px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 
                                animate-shine   animate-shine button-glow  text-[2.2vh] h-[5.5vh] z-[10] translate-y-[-12vh] button-glow tracking-wider transition-opacity duration-300 ${isSpinning || loading || (hasSpun && prizeWon?.name !== "Tente de novo")
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105"
            }`}
          style={{ fontFamily: "'Bangers', cursive", marginTop: "90vh" }}
        >
          {isSpinning
            ? "Girando..."
            : loading
              ? "Buscando prêmio..."
              : hasSpun && prizeWon?.name === "Tente de novo"
                ? "TENTE NOVAMENTE"
                : "GIRE A ROLETA"}
        </button>
      </div>

      {hasSpun && (
        <p
          className="mt-16  text-lg z-10"
          style={{ fontFamily: "'Bangers', cursive", color: "#ff0000" }}
        >
          Tente novamente em 3 horas
        </p>
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md text-center animate-pop">
            {prizeWon.name === "Nada 😢" ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-red-600" >
                  😢 Infelizmente não foi dessa vez
                </h2>
                <p className="text-md mb-6 text-gray-700">
                  Mas não desanime, você pode tentar mais tarde!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-yellow-400" >
                   Parabéns! 
                </h2>
                <img
                  src={prizeWon.image}
                  alt={prizeWon.name}
                  className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg border border-gray-200 shadow-sm"
                />
                <p className="text-lg mb-6 text-gray-700">
                  Você ganhou um cupom de <strong className="text-yellow-700"><a>{prizeWon.name} </a></strong>para usar nas suas compras
                </p>
               <div className="flex items-center gap-4 mb-6">
  <p className="text-sm text-gray-700">
    Use o código no carrinho para aplicar o desconto!
  </p>
  <button className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded hover:bg-yellow-100 transition">
    NFS125
  </button>
</div>

              </>
            )}
             

            <button
              onClick={() => setShowModal(false)}
              className=" px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700   shadow-md transition"
              
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {showAdModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div
            className="relative rounded-2xl border-4 border-white shadow-2xl w-[90vw] max-w-md h-[400px] text-center animate-pop flex flex-col items-center justify-center"
            style={{
              backgroundImage: 'url("/img/ad.webp")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#ffffff',
              cursor: "pointer",
            }}
            onClick={() => toGoingSiteAd()} // Somente aqui chama o redirecionamento
          >
            {/* Botão no canto superior direito */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Impede que clique no botão dispare o clique da modal
                if (adClosable) {
                  setShowAdModal(false);
                }
              }}
              className="absolute top-2 right-3 text-black text-1xl "

            >
              {adClosable ? "×" : adCountdown}
            </button>
          </div>
        </div>
      )}

    </div>

  );
}


