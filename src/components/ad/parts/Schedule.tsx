"use client";
import React, { useEffect, useMemo, useState } from "react";

type ScheduleProps = {
  onChange?: (data: { start: Date | null; end: Date | null; usarFim: boolean }) => void;
};

export default function Schedule({ onChange }: ScheduleProps) {
  const [iniData, setIniData] = useState("");
  const [iniHora, setIniHora] = useState("");
  const [usarFim, setUsarFim] = useState(false);
  const [fimData, setFimData] = useState("");
  const [fimHora, setFimHora] = useState("");

  const start = useMemo(() => toDate(iniData, iniHora), [iniData, iniHora]);
  const end = useMemo(
    () => (usarFim ? toDate(fimData, fimHora) : null),
    [usarFim, fimData, fimHora]
  );

  useEffect(() => {
    onChange?.({ start, end, usarFim });
  }, [start, end, usarFim, onChange]);

  return (
    <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
      <p className="text-large text-gray-300 mb-4 font-bold">Programação da Campanha</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Data de início</label>
          <input
            type="date"
            value={iniData}
            onChange={(e) => setIniData(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horário de início</label>
          <input
            type="time"
            value={iniHora}
            onChange={(e) => setIniHora(e.target.value)}
            className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      <label className="inline-flex items-center mb-4">
        <input
          type="checkbox"
          checked={usarFim}
          onChange={(e) => setUsarFim(e.target.checked)}
          className="form-checkbox text-yellow-500"
        />
        <span className="ml-2 text-sm">Definir data e horário de término</span>
      </label>

      {usarFim && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data de término</label>
            <input
              type="date"
              value={fimData}
              onChange={(e) => setFimData(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Horário de término</label>
            <input
              type="time"
              value={fimHora}
              onChange={(e) => setFimHora(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function toDate(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const iso = `${date}T${time}:00`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}
