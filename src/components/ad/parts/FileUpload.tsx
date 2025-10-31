"use client";
import React, { useRef, useState } from "react";

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const open = () => inputRef.current?.click();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "");
  };

  return (
    <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Upload do Criativo (imagem ou vídeo)
      </label>

      <button
        type="button"
        onClick={open}
        className="px-4 py-2 bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 text-gray-100 rounded transition"
      >
        Selecionar Arquivo
      </button>

      <input type="file" ref={inputRef} onChange={onChange} className="hidden" />

      {fileName && (
        <p className="mt-3 text-sm text-gray-400">
          Arquivo selecionado: <span className="font-medium text-yellow-400">{fileName}</span>
        </p>
      )}
    </div>
  );
}
