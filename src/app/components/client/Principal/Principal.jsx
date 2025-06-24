import { useRouter } from "next/navigation";

export default function Principal() {
    const router = useRouter();
    const toGoBusiness = () =>{
            router.push(`/pages/client/business`);
        }
    return (
        <>
    <p className="text-lg">Bem-vindo ao painel!</p>
    <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition 
      mt-2" onClick={toGoBusiness}
    >Anuncie</button>
    </>
    )
}
