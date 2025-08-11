"use client";
import { useState } from "react";

export default function Ads() {
    const [showModal, setShowModal] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState(null);

    const [anuncios, setAnuncios] = useState([
        {
            id: 1,
            tipo: "CPC",
            titulo: "Viagem República Dominicana",
            arquivo: "/img/republicaAd.jpeg",
            dataCompra: "28/06/2025",
            diasRestantes: 12,
            ativo: true,
        },
        {
            id: 2,
            tipo: "CPC",
            titulo: "Curso de Inglês Online",
            arquivo: "/img/inglesAd.jpeg",
            dataCompra: "27/06/2025",
            diasRestantes: 8,
            ativo: false,
        },
        {
            id: 3,
            tipo: "CPV",
            titulo: "Aprenda a falar Inglês",
            arquivo: "/video/ingles1.mp4",
            dataCompra: "25/06/2025",
            diasRestantes: 5,
            ativo: true,
        },
    ]);
    const handleToggle = (anuncio) => {
        if (anuncio.ativo) {
            setSelectedAnuncio(anuncio);
            setShowModal(true);
        } else {
            toggleStatus(anuncio.id);
        }
    };

    const toggleStatus = (id) => {
        setAnuncios((prev) =>
            prev.map((anuncio) =>
                anuncio.id === id ? { ...anuncio, ativo: !anuncio.ativo } : anuncio
            )
        );
        setShowModal(false);
        setSelectedAnuncio(null);
    };




    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Seus Anúncios</h2>

            {anuncios.map((anuncio) => (
                <div
                    key={anuncio.id}
                    className="bg-[#2c2c2e] p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {anuncio.tipo === "CPC" ? (
                            <img
                                src={anuncio.arquivo}
                                alt={anuncio.titulo}
                                className="w-24 h-24 object-cover rounded"
                            />
                        ) : (
                            <video
                                src={anuncio.arquivo}
                                className="w-24 h-24 rounded"
                                muted
                                loop
                                autoPlay
                            />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                            <p className="text-sm text-gray-400">
                                Tipo: {anuncio.tipo} | Comprado em: {anuncio.dataCompra}
                            </p>
                            <p className="text-sm text-gray-400">
                                Dias restantes: {anuncio.diasRestantes}
                            </p>
                            <p
                                className={`text-sm font-medium ${anuncio.ativo ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {anuncio.ativo ? "Ativo" : "Desativado"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => handleToggle(anuncio)}
                            className={`px-4 py-2 rounded transition ${anuncio.ativo
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white`}
                        >
                            {anuncio.ativo ? "Desativar" : "Ativar"}
                        </button>
                    </div>
                </div>
            ))}
            {showModal && selectedAnuncio && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                    <div className="bg-[#1f1f1f] text-white p-6 rounded-lg max-w-md w-full shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Deseja desativar este anúncio?</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Você desativando seu anúncio continuará contando os dias restantes da mesma forma
                            e seu anúncio não será mais mostrado no sistema.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => toggleStatus(selectedAnuncio.id)}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
