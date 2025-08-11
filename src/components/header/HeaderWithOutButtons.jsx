import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const toGoForm = () =>{
        router.push(`/`);
    }
  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4  shadow-md flex justify-between items-center z-50">
      <div className="flex items-center">
        <img src="/img/gluck_logo_transparent_amarelo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      <div className="flex items-center space-x-4">
        {/* <button className="text-white font-[Roboto]" onClick={toGoForm}>
          X
        </button> */}
        
      </div>
    </header>
  );
}
