"use client";
import React, { useState } from "react";
import { Range } from "react-range";

const STEP = 1, MIN = 0, MAX = 100;

function Chips({
  label,
  datalistId,
  options,
}: {
  label: string;
  datalistId: string;
  options: string[];
}) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const max = 10;

  const add = () => {
    const v = input.trim();
    if (v && !items.includes(v) && items.length < max) setItems([...items, v]);
    setInput("");
  };
  const remove = (v: string) => setItems(items.filter((i) => i !== v));

  return (
    <>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          className="form-checkbox text-yellow-500"
          onChange={(e) => setShow(e.target.checked)}
        />
        <span className="ml-2">{label}</span>
      </label>

      {show && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              list={datalistId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
              placeholder="Digite ou selecione"
              className="w-full p-3 bg-gray-700 text-gray-100 rounded"
            />
            <button
              type="button"
              onClick={add}
              className="bg-yellow-500 text-gray-900 px-4 rounded hover:bg-yellow-600"
            >
              Adicionar
            </button>
          </div>

          <datalist id={datalistId}>
            {options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>

          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((v) => (
              <span
                key={v}
                className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {v}
                <button onClick={() => remove(v)} className="text-red-600 font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Segmentation() {
  const [values, setValues] = useState([20, 60]);
  const [gender, setGender] = useState<"todos" | "feminino" | "masculino">("todos");

  return (
    <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
      <p className="text-large text-gray-300 mb-4 font-bold">
        Segmentação (interesses, faixa etária e perfil)
      </p>

      {/* Hobbies */}
      <Chips
        label="Hobbies (ex: esportes, games, moda)"
        datalistId="listaHobbies"
        options={[
          "Futebol",
          "Ciclismo",
          "Moda",
          "Games",
          "Leitura",
          "Música",
          "Cozinhar",
          "Caminhada",
        ]}
      />

      {/* Profissões */}
      <Chips
        label="Profissões (ex: médicos, advogados, motoristas)"
        datalistId="listaProfissoes"
        options={[
          "Médico",
          "Advogado",
          "Motorista",
          "Professor",
          "Estudante",
          "Engenheiro",
          "Designer",
          "Empresário",
        ]}
      />

      {/* Faixa Etária */}
      <div className="w-full mt-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Faixa Etária</label>
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={setValues}
          renderTrack={({ props, children }) => {
            // 👇 Removendo 'key' do spread
            const { key, style, ...rest } = (props as any);
            return (
              <div
                key={key}
                {...rest}
                className="h-2 w-full rounded-full"
                style={{
                  ...style,
                  background: `linear-gradient(to right, 
                    #4b5563 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
                    #facc15 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
                    #facc15 ${((values[1] - MIN) / (MAX - MIN)) * 100}%,
                    #4b5563 ${((values[1] - MIN) / (MAX - MIN)) * 100}%)`,
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            // 👇 Removendo 'key' do spread
            const { key, ...rest } = (props as any);
            return (
              <div
                key={key}
                {...rest}
                className="h-4 w-4 rounded-full bg-yellow-400 border-2 border-white shadow cursor-pointer"
              />
            );
          }}
        />
        <div className="flex justify-between mt-3 text-sm text-yellow-400 font-semibold">
          <span>{values[0]} anos</span>
          <span>{values[1]} anos</span>
        </div>
      </div>

      {/* Gênero */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Gênero do público-alvo</label>
        <div className="flex flex-wrap gap-6">
          {(["todos", "feminino", "masculino"] as const).map((g) => (
            <label key={g} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="genero"
                value={g}
                checked={gender === g}
                onChange={(e) => setGender(e.target.value as any)}
                className="form-radio text-yellow-500 focus:ring-yellow-500"
              />
              <span className="ml-2 capitalize">{g}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
