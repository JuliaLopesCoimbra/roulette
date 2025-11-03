"use client";
import Image from "next/image";
import { Bell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  companyName?: string;
  avatarUrl?: string;
}

export default function Header({
  companyName = "PIC BRAND",
  avatarUrl = "/img/avatar.jpg",
}: HeaderProps) {
  const router = useRouter();

  const goToBusiness = () => {
    router.push("/pages/client/business");
  };

  return (
    <header
      className="w-full h-16 flex items-center justify-between px-6 border-b border-white/10 bg-white/5 backdrop-blur-xl"
       style={{
        background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
      }}
    >
        <div className="flex justify-center ">
          <img
            src="/img/logo/adword.png"
            alt="Muscle Club"
            className="h-10 w-auto opacity-95"
          />
        </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        
        {/* ✅ Botão Criar Anúncio */}
        <button
          onClick={goToBusiness}
          className="flex items-center gap-2 bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-lg font-medium hover:bg-white/10 active:scale-95 transition"
        >
          <Plus size={18} />
          Inserir anúncio
        </button>

        {/* Notificações */}
        <button className="relative group">
          <Bell className="text-gray-300 group-hover:text-white transition" size={22} />
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Info do usuário */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div>
            <p className="text-sm font-medium text-white">{companyName}</p>
            <p className="text-xs text-gray-400">Conta empresarial</p>
          </div>

          <Image
            src={avatarUrl}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full border border-white/20 group-hover:scale-105 transition"
          />
        </div>
      </div>
    </header>
  );
}
