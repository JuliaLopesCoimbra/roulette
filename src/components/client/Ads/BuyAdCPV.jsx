"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Step1Intro from "../../ad/parts/Step1Intro";
import Step2Budget from "../../ad/parts/Step2Budget";
import Step3Segmentation from "../../ad/parts/Step3Segmentation";
import Step4Review from "../../ad/parts/Step4Review";

const TOTAL_STEPS = 4;

export default function BuyAdCPV() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("click"); // definido na etapa 1

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div
      className="fixed inset-0 grid grid-rows-[auto,1fr] text-white"
       style={{
  background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
}}
    >
      <header className="relative z-50 h-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-[80vw] max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Etapa {step} de {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#fb4667] transition-all"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-0 h-full min-h-0 overflow-auto">
        <div className="min-h-full flex items-start justify-center p-4 pb-24">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Intro
                key="step1"
                next={() => setStep(2)}
                setGoal={setGoal} // Step1 define "click" | "view"
              />
            )}
            {step === 2 && (
              <Step2Budget key="step2" next={next} back={back} goal={goal} />
            )}
            {step === 3 && <Step3Segmentation key="step3" next={next} back={back} />}
            {step === 4 && <Step4Review key="step4" back={back} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
