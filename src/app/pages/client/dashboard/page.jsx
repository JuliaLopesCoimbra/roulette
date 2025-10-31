"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Ads from "../../../../components/client/Ads/Ads";
import Analytics from "../../../../components/client/Analytics/Analytics";
import Principal from "../../../../components/client/Principal/Principal";
import Profile from "../../../../components/client/Profile/Profile";
import Chart from "../../../../components/client/Chart/Chart";
import About from "../../../../components/client/About/About";
import Faq from "../../../../components/client/Faq/Faq";
import Settings from "../../../../components/client/Settings/Settings";
import Support from "../../../../components/client/Suport/Support";
import Header from "../../../../components/header/private/HeaderClient";
import { getClientToken, clearClientToken } from "../../../../utils/auth";
import { api } from "../../../../utils/api"; 

export default function Dashboard() {
  const router = useRouter();
  const [selected, setSelected] = useState("inicio");
  const [companyName, setCompanyName] = useState("Carregando...");

  useEffect(() => {
    const token = getClientToken();
    if (!token) {
      clearClientToken();
      router.replace("/pages/client/signInClient");
      return;
    }

    // 🔹 pega o nome do cliente
    (async () => {
      try {
        const me = await api.meClient();
        // tente pegar em ordem de preferência
        const name =
          me?.fantasy_name ||
          me?.corporate_name ||
          me?.responsable_name ||
          me?.email ||
          "Minha Empresa";
        setCompanyName(name);
      } catch (err) {
        // se deu 401/403, token inválido → volta pro login
        if (err?.status === 401 || err?.status === 403) {
          clearClientToken();
          router.replace("/pages/client/signInClient");
        } else {
          console.error("Falha ao carregar /me-client:", err);
          setCompanyName("Minha Empresa");
        }
      }
    })();
  }, [router]);

const renderComponent = () => {
  switch (selected) {
    case "inicio": return <Principal />;
    case "anuncios": return <Ads />;
    case "Funil de Conversões": return <Chart />;
    case "analytics": return <Analytics />;
    case "perfil": return <Profile />;
    case "sobre": return <About />;
    case "duvidas": return <Faq />;
    case "config": return <Settings />;
    case "suporte": return <Support />;
    default: return <Principal />;
  }
};


  return (
    <div
      className="h-screen w-screen flex overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%), #0b0b0d",
      }}
    >
      {/* Sidebar */}
    <aside className="w-64 flex-shrink-0 px-5 py-8 backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col">
  <h2 className="text-xl font-bold tracking-wide mb-8">Painel</h2>

  {/* MENU PRINCIPAL */}
  <nav className="space-y-2 flex-1">
    {[
      { key: "inicio", label: "Início" },
      { key: "anuncios", label: "Anúncios" },
      { key: "Funil de Conversões", label: "Funil de Conversões" },
      { key: "analytics", label: "Análises" },
    ].map((item) => (
      <button
        key={item.key}
        onClick={() => setSelected(item.key)}
        className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
          selected === item.key ? "bg-yellow-500 text-black shadow-md" : "hover:bg-white/10"
        }`}
      >
        {item.label}
      </button>
    ))}
  </nav>

  {/* MENU SECUNDÁRIO (mais abaixo) */}
  <div className="space-y-2 mt-10 border-t border-white/10 pt-6">
    {[
      { key: "perfil", label: "Perfil" },
      { key: "sobre", label: "Sobre" },
      { key: "duvidas", label: "Dúvidas" },
      { key: "config", label: "Configurações" },
      { key: "suporte", label: "Suporte" },
    ].map((item) => (
      <button
        key={item.key}
        onClick={() => setSelected(item.key)}
        className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
          selected === item.key ? "bg-yellow-500 text-black shadow-md" : "hover:bg-white/10"
        }`}
      >
        {item.label}
      </button>
    ))}

    {/* BOTÃO SAIR */}
    <button
      onClick={() => {
        clearClientToken();
        router.replace("/pages/client/signInClient");
      }}
      className="w-full text-left px-4 py-2 rounded-lg transition font-medium hover:bg-red-500 hover:text-black"
    >
      Sair
    </button>
  </div>
</aside>


      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto">
        {/* 🔹 Header recebendo o nome do /me-client */}
        <Header companyName={companyName} />
        <div className="p-10">
          <h1 className="text-3xl font-semibold mb-8 capitalize">{selected}</h1>
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
