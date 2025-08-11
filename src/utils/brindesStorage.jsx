"use client";
import dayjs from "dayjs";

const STORAGE_KEY = "brindesDoUsuario";

function getAllBrindes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setAllBrindes(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function getBrindesDeHoje() {
  const hoje = dayjs().format("YYYY-MM-DD");
  return getAllBrindes().filter(
    (b) => dayjs(b.data).format("YYYY-MM-DD") === hoje
  );
}

export function addBrindeHoje(premio) {
  const agoraISO = dayjs().toISOString();
  const todos = getAllBrindes();

  const hoje = dayjs().format("YYYY-MM-DD");
  const qtdHoje = todos.filter(
    (b) => dayjs(b.data).format("YYYY-MM-DD") === hoje
  ).length;

  if (qtdHoje >= 3) {
    return { ok: false, reason: "limit" };
  }

  todos.push({ data: agoraISO, premio });
  setAllBrindes(todos);
  return { ok: true };
}

export function canSpinByDailyLimit() {
  return getBrindesDeHoje().length < 3;
}
