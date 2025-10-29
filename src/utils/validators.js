// utils/validators.js

// ---- CPF ----
export const formatCPF = (value = "") =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export function validarCPF(raw = "") {
  let cpf = raw.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

// ---- CELULAR ----
export const formatCelular = (value = "") =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

export const validarCelular = (value = "") =>
  /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(value);

// ---- E-MAIL ----
export const validarEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).toLowerCase());

// ---- CEP ----
export const limparCEP = (v = "") => v.replace(/\D/g, "");
export const validarCEP = (v = "") => /^\d{8}$/.test(limparCEP(v));

export async function buscarEnderecoPorCEP(cepLimpo) {
  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!res.ok) throw new Error("Erro ao consultar CEP");
  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado");
  return {
    rua: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
  };
}
