// components/ProgressDots.jsx
export default function ProgressDots({ step, total = 4 }) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        return (
          <div
            key={idx}
            className={`w-1 h-1 rounded-full ${
              step === idx ? "bg-[#fb4667]" : "bg-gray-600"
            }`}
          />
        );
      })}
    </div>
  );
}
