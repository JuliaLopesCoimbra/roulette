"use client";
import React, { useRef, useState, useMemo } from "react";
import { Range } from "react-range";
import {
  GoogleMap,
  Marker,
  Circle,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const MIN = 1, MAX = 50, STEP = 1;
const centerPadrao = { lat: -23.55052, lng: -46.633308 };
const containerStyle = { width: "100%", height: "400px" };

export default function MapaGoogle() {
  const [center, setCenter] = useState(centerPadrao);
  const [values, setValues] = useState([5]);
  const autocompleteRef = useRef(null);

  // evita recriar o array a cada render (algumas versões exigem referência estável)
  const libraries = useMemo(() => ["places"], []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
console.log("KEY EM USO:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);


  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace?.();
    const loc = place?.geometry?.location;
    if (loc) {
      setCenter({ lat: loc.lat(), lng: loc.lng() });
    }
  };

  if (loadError) {
    return (
      <p className="text-red-400">
        Erro ao carregar Google Maps: {String(loadError)}
      </p>
    );
  }

  if (!isLoaded) {
    return <p className="text-gray-300">Carregando mapa…</p>;
  }

  const pct = ((values[0] - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-1">Buscar endereço</label>
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Digite cidade, bairro ou rua..."
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
          />
        </Autocomplete>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-1 mt-2">
          Raio em quilômetros
        </label>
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={setValues}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full rounded-full mt-4 mb-2"
              style={{
                ...props.style,
                background: `linear-gradient(to right, #4b5563 ${pct}%, #facc15 ${pct}%, #facc15 ${pct}%, #4b5563 ${pct}%)`,
              }}
            >
              {children}
            </div>
          )}
     renderThumb={({ props }) => {
  const { key, ...restProps } = props; // remove key
  return (
    <div
      {...restProps}
      key={key} // aplica explicitamente o key
      className="h-4 w-4 rounded-full bg-[#fb4667] border-2 border-white shadow cursor-pointer"
    />
  );
}}

        />
        <p className="text-sm text-gray-300">
          Raio selecionado:{" "}
          <span className="text-[#fb4667] font-semibold">{values[0]} km</span>
        </p>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={center} />
        <Circle
          center={center}
          radius={values[0] * 1000}
          options={{
            fillColor: "#FFEB3B",
            fillOpacity: 0.3,
            strokeColor: "#FBC02D",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
}
