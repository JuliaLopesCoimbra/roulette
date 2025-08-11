import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const toGoForm = () =>{
        router.push(`/pages/user/signUp`);
    }
    const toGoLogin = () =>{
        router.push(`/pages/user/signIn`);
    }
  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4  shadow-md flex justify-between items-center z-50">
      <div className="flex items-center">
        <img src="/img/logo/gluck_logo.png" alt="Logo" className="h-15 w-auto" />
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold" onClick={toGoForm}>
          Registre-se
        </button>
        <button className="px-4 py-2 border border-[#973bfe] text-white rounded hover:bg-purple-500 transition" onClick={toGoLogin}>
          Login
        </button>
      </div>
    </header>
  );
}
