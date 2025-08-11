import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const toGoForm = () =>{
        router.push(`/pages/client/signUpClient`);
    }
    const toGoLogin = () =>{
        router.push(`/pages/client/signInClient`);
    }
  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4  shadow-md flex justify-between items-center z-50">
      <div className="flex items-center">
        <img src="/img/gluck_logo_transparent_amarelo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition" onClick={toGoForm}>
          Registre-se
        </button>
        <button className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded hover:bg-yellow-100 transition" onClick={toGoLogin}>
          Login
        </button>
      </div>
    </header>
  );
}
