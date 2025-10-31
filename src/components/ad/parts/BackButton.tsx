"use client";
import React from "react";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-6 left-6 z-10">
      <button
        onClick={onClick}
        className="text-yellow-500 hover:text-yellow-400 transition"
        aria-label="Voltar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
