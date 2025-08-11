"use client";
import MapaComRaio from "@/components/gps/GoogleMaps";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Range } from "react-range";
const STEP = 1;
const MIN = 0;
const MAX = 100;

export default function BuyAdCPV() {
    const router = useRouter();
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [showHobbies, setShowHobbies] = useState(false);
    const [showProfissoes, setShowProfissoes] = useState(false);
    const [hobbiesSelecionados, setHobbiesSelecionados] = useState([]);
    const [profissoesSelecionadas, setProfissoesSelecionadas] = useState([]);
    const [hobbieInput, setHobbieInput] = useState("");
    const [profissaoInput, setProfissaoInput] = useState("");
    const [selecionados, setSelecionados] = useState([]);
    const [tipoOrcamento, setTipoOrcamento] = useState("diario");
    const [values, setValues] = useState([20, 60]);
    const [valor, setValor] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [usarDataFim, setUsarDataFim] = useState(false);
    const [dataFim, setDataFim] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [generoSelecionado, setGeneroSelecionado] = useState("todos");
    const maxItens = 10;
    const adicionarHobbie = () => {
        const valor = hobbieInput.trim();
        if (valor && !hobbiesSelecionados.includes(valor) && hobbiesSelecionados.length < maxItens) {
            setHobbiesSelecionados([...hobbiesSelecionados, valor]);
        }
        setHobbieInput("");
    };

    const adicionarProfissao = () => {
        const valor = profissaoInput.trim();
        if (valor && !profissoesSelecionadas.includes(valor) && profissoesSelecionadas.length < maxItens) {
            setProfissoesSelecionadas([...profissoesSelecionadas, valor]);
        }
        setProfissaoInput("");
    };

    const removerItem = (tipo, item) => {
        if (tipo === "hobbie") {
            setHobbiesSelecionados(hobbiesSelecionados.filter((h) => h !== item));
        } else {
            setProfissoesSelecionadas(profissoesSelecionadas.filter((p) => p !== item));
        }
    };
    const adicionarEstado = (e) => {
        const valor = e.target.value;
        if (valor && !selecionados.includes(valor)) {
            setSelecionados([...selecionados, valor]);
        }
        e.target.value = ""; // resetar após selecionar
    };

    const removerEstado = (sigla) => {
        setSelecionados(selecionados.filter((item) => item !== sigla));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName("");
        }
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };
    const formatarParaReais = (valorDigitado) => {
        const apenasNumeros = valorDigitado.replace(/\D/g, "");
        const numero = parseFloat(apenasNumeros) / 100;
        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleValorChange = (e) => {
        const valorFormatado = formatarParaReais(e.target.value);
        setValor(valorFormatado);
    };
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxAge - 1);
        setMinAge(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minAge + 1);
        setMaxAge(value);
    };

    return (
        <div className="min-h-screen p-6 relative bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Botão Voltar */}
            <div className="absolute top-6 left-6 z-10">
                <button
                    onClick={() => router.back()}
                    className="text-yellow-500 hover:text-yellow-400 transition"
                    aria-label="Voltar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Conteúdo do Formulário */}
            <form className="max-w-2xl mx-auto space-y-6 mt-10">
                {/* Bloco 1 */}
                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Nome da Campanha CPV</label>
                    <input
                        type="text"
                        placeholder="Ex: Nova Coleção de Verão"
                        className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow mt-6 text-gray-200">
                    <p className="text-large text-gray-300 mb-4 font-bold">Orçamento da Campanha</p>
                    <p className="text-sm text-gray-300 mb-4">
                        O orçamento define quanto você deseja investir na exibição do seu anúncio dentro da plataforma.
                        Você pode escolher entre definir um valor diário fixo (quanto será gasto por dia) ou um valor total (quanto pretende investir ao longo de toda a campanha).
                        Em seguida, basta programar a data e hora de início e término do seu anúncio.
                        Com base nessas informações, otimizaremos a entrega da sua campanha para atingir o melhor resultado dentro do valor definido.
                    </p>
                    {/* Tipo de orçamento + valor */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                        {/* Seleção de tipo */}
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium mb-1">Tipo de Orçamento</label>
                            <select
                                value={tipoOrcamento}
                                onChange={(e) => setTipoOrcamento(e.target.value)}
                                className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="diario">Orçamento Diário</option>
                                <option value="total">Orçamento Total</option>
                            </select>
                        </div>

                        {/* Valor */}
                        <div className="w-full md:w-2/3">
                            <label className="block text-sm font-medium mb-1 text-gray-200">Valor (R$)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={valor}
                                onChange={handleValorChange}
                                placeholder="Ex: R$ 100,00"
                                className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow mt-6 text-gray-200">
                        <p className="text-large text-gray-300 mb-4 font-bold">Programação da Campanha</p>
                        <p className="text-sm text-gray-300 mb-4">
                            Definir a data e o horário de início da campanha permite que seu anúncio comece a ser exibido exatamente no momento planejado, alinhado com estratégias promocionais, lançamentos ou eventos específicos.
                            Se desejar, você também pode programar uma data e hora de término, o que garante maior controle sobre a duração e o investimento total da campanha.
                            Caso não defina uma data final, sua campanha continuará ativa até que você a pause manualmente ou atinja o limite de orçamento.
                        </p>

                        {/* Início da campanha */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Data de início</label>
                                <input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Horário de início</label>
                                <input
                                    type="time"
                                    value={horaInicio}
                                    onChange={(e) => setHoraInicio(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Checkbox para ativar data de fim */}
                        <label className="inline-flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={usarDataFim}
                                onChange={(e) => setUsarDataFim(e.target.checked)}
                                className="form-checkbox text-yellow-500"
                            />
                            <span className="ml-2 text-sm">Deseja definir data final da campanha?</span>
                        </label>

                        {/* Fim da campanha - aparece somente se checkbox estiver marcado */}
                        {usarDataFim && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Data de término</label>
                                    <input
                                        type="date"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                        className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Horário de término</label>
                                    <input
                                        type="time"
                                        value={horaFim}
                                        onChange={(e) => setHoraFim(e.target.value)}
                                        className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
                    <p className="text-large text-gray-300 mb-4 font-bold">
                        Categorize seu anúncio para alcançar o público ideal. Declare interesses, localização e perfil demográfico.
                    </p>
                    <p className="text-sm text-gray-300 mb-4 ">
                        Para que seu anúncio tenha o melhor desempenho possível, é essencial direcioná-lo ao público certo.
                        Aqui, você pode categorizar sua campanha com base em interesses, localização geográfica, faixa etária, profissão e outros critérios demográficos.
                        Quanto mais precisa for a segmentação, maior a chance de atrair pessoas realmente interessadas no seu produto ou serviço — aumentando o retorno sobre o investimento e a eficiência da campanha.
                    </p>


                    <div>
                        <label className="block text-sm font-medium mb-2">Deseja segmentar por:</label>

                        {/* Hobbies */}
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                className="form-checkbox text-yellow-500"
                                onChange={(e) => setShowHobbies(e.target.checked)}
                            />
                            <span className="ml-2">Hobbies (ex: esportes, games, moda)</span>
                        </label>

                        {showHobbies && (
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        list="listaHobbies"
                                        value={hobbieInput}
                                        onChange={(e) => setHobbieInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarHobbie())}
                                        placeholder="Digite ou selecione um hobbie"
                                        className="w-full p-3 bg-gray-700 text-gray-100 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={adicionarHobbie}
                                        className="bg-yellow-500 text-white px-4 rounded hover:bg-yellow-600"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                                <datalist id="listaHobbies">
                                    <option value="Futebol" />
                                    <option value="Ciclismo" />
                                    <option value="Moda" />
                                    <option value="Games" />
                                    <option value="Leitura" />
                                    <option value="Música" />
                                    <option value="Cozinhar" />
                                    <option value="Caminhada" />
                                </datalist>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {hobbiesSelecionados.map((hobbie, index) => (
                                        <span
                                            key={index}
                                            className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {hobbie}
                                            <button onClick={() => removerItem("hobbie", hobbie)} className="text-red-600 font-bold">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Profissões */}
                        <label className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                className="form-checkbox text-yellow-500"
                                onChange={(e) => setShowProfissoes(e.target.checked)}
                            />
                            <span className="ml-2">Profissões (ex: médicos, advogados, motoristas)</span>
                        </label>

                        {showProfissoes && (
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        list="listaProfissoes"
                                        value={profissaoInput}
                                        onChange={(e) => setProfissaoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarProfissao())}
                                        placeholder="Digite ou selecione uma profissão"
                                        className="w-full p-3 bg-gray-700 text-gray-100 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={adicionarProfissao}
                                        className="bg-yellow-500 text-white px-4 rounded hover:bg-yellow-600"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                                <datalist id="listaProfissoes">
                                    <option value="Médico" />
                                    <option value="Advogado" />
                                    <option value="Motorista" />
                                    <option value="Professor" />
                                    <option value="Estudante" />
                                    <option value="Engenheiro" />
                                    <option value="Designer" />
                                    <option value="Empresário" />
                                </datalist>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {profissoesSelecionadas.map((profissao, index) => (
                                        <span
                                            key={index}
                                            className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {profissao}
                                            <button onClick={() => removerItem("profissao", profissao)} className="text-red-600 font-bold">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Faixa Etária
                            </label>

                            <Range
                                values={values}
                                step={STEP}
                                min={MIN}
                                max={MAX}
                                onChange={setValues}
                                renderTrack={({ props, children }) => (
                                    <div
                                        {...props}
                                        className="h-2 w-full rounded-full bg-gray-600"
                                        style={{
                                            ...props.style,
                                            background: `linear-gradient(to right, 
                #4b5563 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
                #facc15 ${((values[0] - MIN) / (MAX - MIN)) * 100}%,
                #facc15 ${((values[1] - MIN) / (MAX - MIN)) * 100}%,
                #4b5563 ${((values[1] - MIN) / (MAX - MIN)) * 100}%)`,
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

                            <div className="flex justify-between mt-3 text-sm text-yellow-400 font-semibold">
                                <span>{values[0]} anos</span>
                                <span>{values[1]} anos</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow mt-6 text-gray-200">
                    <label className="block text-sm font-medium mb-4">Gênero do público-alvo</label>

                    <div className="flex flex-wrap gap-6">
                        {/* Todos */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="genero"
                                value="todos"
                                checked={generoSelecionado === "todos"}
                                onChange={(e) => setGeneroSelecionado(e.target.value)}
                                className="form-radio text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="ml-2">Todos</span>
                        </label>

                        {/* Feminino */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="genero"
                                value="feminino"
                                checked={generoSelecionado === "feminino"}
                                onChange={(e) => setGeneroSelecionado(e.target.value)}
                                className="form-radio text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="ml-2">Feminino</span>
                        </label>

                        {/* Masculino */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="genero"
                                value="masculino"
                                checked={generoSelecionado === "masculino"}
                                onChange={(e) => setGeneroSelecionado(e.target.value)}
                                className="form-radio text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="ml-2">Masculino</span>
                        </label>
                    </div>
                </div>
                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                        Localização do público-alvo
                    </label>
                    <MapaComRaio />
                </div>

                <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Upload do Criativo (imagem ou vídeo)
                    </label>

                    <button
                        type="button"
                        onClick={openFileDialog}
                        className="px-4 py-2 bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 text-gray-100 rounded transition"
                    >
                        Selecionar Arquivo
                    </button>

                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {fileName && (
                        <p className="mt-3 text-sm text-gray-400">
                            Arquivo selecionado: <span className="font-medium text-yellow-400">{fileName}</span>
                        </p>
                    )}
                </div>

                {/* Botão Finalizar */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded transition"
                    >
                        Finalizar Compra do Anúncio
                    </button>
                </div>
            </form>
        </div>
    );
}
