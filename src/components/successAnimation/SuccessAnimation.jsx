import { motion, AnimatePresence } from "framer-motion";

export default function SuccessAnimationPulse() {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
        background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 100%)",
          fontFamily: "'Roboto', sans-serif", // ✅ Fonte Roboto
        }}
      >
        <motion.div
          className="bg-[#973bfe] rounded-full w-24 h-24 flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{
            scale: [0.8, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.p
          className="text-white text-xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          Cadastro realizado com sucesso!
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
