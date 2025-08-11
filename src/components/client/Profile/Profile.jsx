"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Profile() {
  const router = useRouter();
  const [dados, setDados] = useState({
    nomeEmpresa: "Pic Brand",
    email: "contato@lojaexemplo.com",
    cnpj: "12.345.678/0001-99",
    telefone: "(11) 98765-4321",
    saldo: 72.50,
  });
  

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSenha = () => {
    if (!senhaAtual || !novaSenha) {
      setMensagem("Preencha os campos corretamente.");
      return;
    }

    // Aqui entraria a lógica de backend para trocar a senha
    setMensagem("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
  };

  return (
    <div className="space-y-8">
    

      {/* Dados da Empresa */}
      <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-3">
        <h3 className="text-lg font-semibold">Dados Cadastrais</h3>
        <p><strong>Empresa:</strong> {dados.nomeEmpresa}</p>
        <p><strong>Email:</strong> {dados.email}</p>
        <p><strong>CNPJ:</strong> {dados.cnpj}</p>
        <p><strong>Telefone:</strong> {dados.telefone}</p>
      </div>

      {/* Saldo */}
      <div className="bg-[#2c2c2e] p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Saldo Atual</h3>
        <p className="text-green-400 text-2xl font-bold">
          R$ {dados.saldo.toFixed(2)}
        </p>
        <button className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white">
          Adicionar Saldo
        </button>
      </div>

      {/* Alterar Senha */}
      {/* <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Alterar Senha</h3>
        <input
          type="password"
          placeholder="Senha atual"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#1f1f1f] border border-gray-600 text-white"
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#1f1f1f] border border-gray-600 text-white"
        />
        {mensagem && <p className="text-sm text-yellow-400">{mensagem}</p>}
        <button
          onClick={handleSenha}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Alterar Senha
        </button>
      {/* Sair da Conta */}
      <div className="text-right">
        <button
          className="text-red-500 hover:underline"
          onClick={() => router.push("/pages/client/signInClient")}
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );

  

}