import React, { useState, useRef } from 'react';
import { Range } from 'react-range';
import {
    GoogleMap,
    LoadScript,
    Marker,
    Circle,
    Autocomplete
} from '@react-google-maps/api';
const MIN = 1; // mínimo 1km
const MAX = 50; // máximo 50km
const STEP = 1;

const centerPadrao = { lat: -23.55052, lng: -46.633308 }; // SP
const radius = 5000; // em metros

const containerStyle = {
    width: '100%',
    height: '400px'
};

const MapaGoogle = () => {
    const [center, setCenter] = useState(centerPadrao);
    const autocompleteRef = useRef(null);
    const [values, setValues] = useState([5]); // valor inicial do raio


    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            setCenter({
                lat: location.lat(),
                lng: location.lng()
            });
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyA1xryY-BSv9zT-nGs1lVPHd1ZNTqskCO0" libraries={['places']}>
            <div className="mb-4">
  <label className="block text-sm font-medium text-white mb-1">Buscar endereço</label>
  <Autocomplete
    onLoad={(ref) => (autocompleteRef.current = ref)}
    onPlaceChanged={onPlaceChanged}
  >
    <input
      type="text"
      placeholder="Digite cidade, bairro ou rua..."
      className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
    />
  </Autocomplete>
</div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-1 mt-2">Raio em quilômetros</label>
                <Range
                    values={values}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={setValues}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="h-2 w-full rounded-full bg-gray-600 mt-4 mb-2"
                            style={{
                                ...props.style,
                                background: `linear-gradient(to right,
          #4b5563 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
          #facc15 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
          #facc15 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
          #4b5563 ${((values[0] - MIN) / (MAX - MIN)) * 100}%)`
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            className="h-4 w-4 rounded-full bg-yellow-400 border-2 border-white shadow cursor-pointer"
                        />
                    )}
                />

                <p className="text-sm text-gray-300">
                    Raio selecionado: <span className="text-yellow-400 font-semibold">{values[0]} km</span>
                </p>

            </div>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                <Marker position={center} />
                <Circle
                    center={center}
                    radius={values[0] * 1000} // usar valor do Range (em metros)
                    options={{
                        fillColor: '#FFEB3B',
                        fillOpacity: 0.3,
                        strokeColor: '#FBC02D',
                        strokeOpacity: 0.8,
                        strokeWeight: 2
                    }}
                />



            </GoogleMap>
        </LoadScript>
    );
};

export default MapaGoogle;
