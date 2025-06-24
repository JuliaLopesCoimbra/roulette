"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/app/components/header/HeaderClient";
export default function Welcome() {
const router = useRouter();
    const toGoForm = () =>{
        router.push(`/pages/client/signUpClient`);
    }
    
    return (
        <>
            <Header />
            <div className=" flex flex-col items-center justify-center h-screen bg-gradient-to-b bg-black bg-opacity-90">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30  z-0"
                    style={{ backgroundImage: "url('/img/fundoClient.jpg')", }}
                />
                <div className="relative z-10" >
                    <div className="p-4 text-center z-0 w-full h-full overflow-auto">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                           
                            <div className="w-full md:w-3/3 text-center text-white px-2">
                                
                                <div className="text-center px-4 py-8 space-y-2 font-[Roboto]" >
                                    <p className="text-1xl md:text-1xl font-bold bg-gradient-to-r from-yellow-300
                                     via-white to-yellow-300 bg-clip-text text-transparent animate-shine
                                      drop-shadow-[1px_1px_0_black]">Você sabe quanto vale um clique. A gente sabe como multiplicá-lo.</p>

                                    <p className="text-3xl md:text-6xl font-bold  drop-shadow-[1px_1px_0_black] bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-shine">
                                        TRANSFORME CADA REAL 
                                    </p>

                                    <p className="text-5xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-shine drop-shadow-[1px_1px_0_black]">
                                        INVESTIDO EM RETORNO REAL
                                    </p>

                                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-shine drop-shadow-[1px_1px_0_black]">
                                        SUA MARCE MERECE
                                    </p>

                                    <p className="text-1xl md:text-1xl font-bold bg-gradient-to-r from-yellow-900 via-white to-yellow-900 bg-clip-text text-transparent animate-shine drop-shadow-[1px_1px_0_black]">
                                        PERFORMANCE DE VERDADE
                                    </p>

                                </div>


                            </div>
                        </div>

                        <div className="mt-4 flex flex-col items-center space-y-3">
                            <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition
                                animate-shine   animate-shine button-glow  mt-2" onClick={toGoForm}>
                                COMEÇAR
                            </button>
                          
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}