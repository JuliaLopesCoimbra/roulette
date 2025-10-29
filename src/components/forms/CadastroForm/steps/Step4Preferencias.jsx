"use client";
import { Controller, useFormContext } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import ProgressDots from "../../../../components/forms/CadastroForm/ProgressDots";
import selectStyles from "../../../../utils/selectStyles";
import useRemoteOptions from "../../../../hooks/useRemoteOptions";
import { api } from "../../../../utils/api.js";
import { useEffect, useMemo, useState } from "react";

export default function Step4Preferencias({
    step,
    setStep,
    redesSelecionadas,
    setRedesSelecionadas,
    onSubmit,
    props,
    isSubmitting,
}) {
    const { control, register, setValue, trigger, formState: { errors } } = useFormContext();
    const { loadingKey, errorKey, fetchOnce, getCached } = useRemoteOptions();
    // estados locais
    const [socials, setSocials] = useState([]);
    const [profOptions, setProfOptions] = useState([]);
    const [hobbyOptions, setHobbyOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [metOptions, setMetOptions] = useState([]);

    // --------- Redes Sociais ----------
    useEffect(() => {
        (async () => {
            try {
                const opts = await fetchOnce("social-medias", api.socialMedias);
                setSocials(opts);
                // opcional: se vier pré-selecionado do form, sincronia aqui
            } catch {
                setSocials([]);
            }
        })();
    }, [fetchOnce]);
    const toggleRedeId = (id) => {
        setRedesSelecionadas((prev) => {
            const exists = prev.includes(id);
            const next = exists ? prev.filter((v) => v !== id) : [...prev, id];
            // sincroniza no RHF
            setValue("social_media_ids", next, { shouldDirty: true });
            return next;
        });
    };

    // --------- Profissões ----------
    const handleOpenProfessions = async () => {
        try {
            const cached = getCached("professions");
            if (cached.length) return setProfOptions(cached);
            const opts = await fetchOnce("professions", api.professions);
            setProfOptions(opts);
        } catch {
            setProfOptions([]);
        }
    };

    // --------- Hobbies ----------
    const handleOpenHobbies = async () => {
        try {
            const cached = getCached("hobbies");
            if (cached.length) return setHobbyOptions(cached);
            const opts = await fetchOnce("hobbies", api.hobbies);
            setHobbyOptions(opts);
        } catch {
            setHobbyOptions([]);
        }
    };

    // --------- Marcas preferidas ----------
    const handleOpenBrands = async () => {
        try {
            const cached = getCached("brands");
            if (cached.length) return setBrandOptions(cached);
            const opts = await fetchOnce("brands", api.brands);
            setBrandOptions(opts);
        } catch {
            setBrandOptions([]);
        }
    };
    // --------- Met Plataforms (origem) ----------
    // --------- Met Plataforms (origem) ----------
    const handleOpenMet = async () => {
        try {
            const data = await api.metPlataforms();
            console.log("Met Plataforms data:", data);
            const opts = data.map(item => ({
                value:item.met_ID, // 👈 garante número
                label: item.description,              // 👈 usa description
                raw: item,
            }));
            console.log("Met Plataforms options:", opts);
            setMetOptions(opts);
        } catch {
            setMetOptions([]);
        }
    };



    return (
        <>
            <div className="absolute top-10 z-10">
                <button onClick={() => setStep(3)} className="text-[#973bfe] hover:text-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Redes sociais */}
            <div className="mt-10">
                <label className="block mb-1">Quais redes sociais você usa?</label>

                {loadingKey === "social-medias" && socials.length === 0 && (
                    <p className="text-xs text-gray-300">Carregando...</p>
                )}
                {errorKey === "social-medias" && socials.length === 0 && (
                    <p className="text-xs text-red-400">Não foi possível carregar as redes.</p>
                )}

                <div className="flex flex-wrap gap-3">
                    {socials.map((opt) => (
                        <label key={opt.value} className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                className="accent-purple-700"
                                checked={redesSelecionadas.includes(opt.value)}
                                onChange={() => toggleRedeId(opt.value)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}

                    {/* Se o array vier vazio do backend, mostra uma info suave */}
                    {socials.length === 0 && loadingKey !== "social-medias" && (
                        <span className="text-xs text-gray-400">Nenhuma rede disponível.</span>
                    )}
                </div>
            </div>

            {/* Profissão */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-white">Profissão</label>
                <Controller
                    name="profissao"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            isClearable
                            options={profOptions}
                            placeholder="Digite ou escolha sua profissão"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            onMenuOpen={handleOpenProfessions}
                        />
                    )}
                />
                {errors.profissao && <p className="text-[#ef4444] text-sm mt-1">{errors.profissao.message}</p>}
            </div>

            {/* Hobbies */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-white">Hobbies</label>
                <Controller
                    name="hobbies"
                    control={control}
                    defaultValue={[]}
                    rules={{
                        validate: (value) => {
                            if (!value || value.length === 0) return "Selecione pelo menos 1 hobby";
                            if (value.length > 4) return "Máximo de 4 hobbies permitidos";
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            isMulti
                            options={hobbyOptions}
                            onChange={(selected) => {
                                if ((selected || []).length <= 4) field.onChange(selected);
                            }}
                            placeholder="Digite ou escolha até 4 hobbies"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            onMenuOpen={handleOpenHobbies}
                        />
                    )}
                />
                {errors.hobbies && <p className="text-[#ef4444] text-sm mt-1">{errors.hobbies.message}</p>}
            </div>

            {/* Marcas preferidas */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-white">Marcas Preferidas</label>
                <Controller
                    name="marcas"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            isMulti
                            options={brandOptions}
                            placeholder="Selecione suas marcas preferidas"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            onMenuOpen={handleOpenBrands}
                        />
                    )}
                />
            </div>

            {/* Origem (met-plataforms) */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-white">Como conheceu a plataforma?</label>
                <Controller
                    name="origem"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                        <CreatableSelect
                            {...field}
                            isClearable
                            options={metOptions}
                            placeholder="Selecione a origem"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            onMenuOpen={handleOpenMet}
                        />
                    )}
                />
                {errors.origem && <p className="text-[#ef4444] text-sm mt-1">{errors.origem.message}</p>}
            </div>

            {/* Termos */}
            <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        {...register("aceita_termos", {
                            required: "Você precisa aceitar os termos de uso de dados.",
                        })}
                        className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-[#973bfe] rounded-full peer-checked:ring-2 peer-checked:ring-[#973bfe] peer-checked:border-4 peer-checked:border-black transition-all duration-200"></div>
                </label>
                <label className="text-sm">
                    Eu aceito os{" "}
                    <a href="#" className="underline">termos de uso de dados</a>.
                </label>
            </div>
            {errors.aceita_termos && (
                <p className="text-[#ef4444] text-sm">{errors.aceita_termos.message}</p>
            )}

            <ProgressDots step={step} />

            <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                <button
                    type="button"
                    onClick={async () => {
                        const ok = await trigger(["profissao", "hobbies", "origem", "aceita_termos"]);
                        if (ok) onSubmit();
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                >
                    {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
                </button>
            </div>
        </>
    );
}
