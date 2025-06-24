import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DollarRain = () => {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    let idCounter = 0;

    const interval = setInterval(() => {
      const newDrop = {
        id: idCounter++,
        left: Math.random() * 100, // posição horizontal em %
        delay: 0,
        duration: 4 + Math.random() * 2, // velocidade
      };

      setDrops((prev) => [...prev, newDrop]);
    }, 300); // cria um novo drop a cada 300ms

    return () => clearInterval(interval);
  }, []);

  // Remove drops antigos após o tempo da animação
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setDrops((prev) =>
        prev.filter((drop) => {
          // Mantém apenas os drops ainda animando
          return drop.createdAt == null || Date.now() - drop.createdAt < 7000;
        })
      );
    }, 3000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{ y: "-10vh", opacity: 0 }}
          animate={{ y: "110vh", opacity: 1 }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            ease: "linear",
          }}
          className="absolute text-yellow-300 text-[40px] drop-shadow-[2px_2px_0_#000]"
          style={{ left: `${drop.left}%` }}
        >
          $
        </motion.div>
      ))}
    </div>
  );
};

export default DollarRain;
