// utils/api.js
import { getUserToken } from "./auth";
import { getClientToken } from "./auth";
export const URL_BASE = "http://127.0.0.1:8010";

async function http(path, init = {}) {
 const userTok = getUserToken?.();
  const clientTok = getClientToken?.();
  const token = clientTok || userTok; // prioriza client_token se existir

   const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${URL_BASE}${path}`, {
    method: init.method || "GET",
    headers,
    ...(init.body ? { body: init.body } : {}),
    ...init,
  });

  if (!res.ok) {
    let payload = null;
    try { payload = await res.json(); } catch {}
    const msg = payload?.detail || payload?.message || (await res.text().catch(()=>""));
    const err = new Error(msg || `Erro ${res.status} em ${path}`);
    // @ts-ignore
    err.status = res.status;
    // @ts-ignore
    err.detail = payload?.detail;
    throw err;
  }
  return res.json();
}
// Helpers específicos
export const api = {
  //analytics
  professions: () => http("/professions"),
  socialMedias: () => http("/social-medias"),
  hobbies: () => http("/hobbies"),
  metPlataforms: () => http("/met-plataforms"),
  brands: () => http("/brands"),
  //user
  signup: (body) =>
    http("/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    http("/login", { method: "POST", body: JSON.stringify(body) }),
  activeRoulette: () => http("/active-roulette", { method: "GET" }),
  updateActiveRoulette: (body) =>
    http("/active-roulette", { method: "PUT", body: JSON.stringify(body) }),
  me: () => http("/me", { method: "GET" }),

  //client
  clientLogin: (body) =>
    http("/login-client", { method: "POST", body: JSON.stringify(body) }),
};
