// utils/api.js
import { getUserToken } from "./auth";
import { getClientToken } from "./auth";
export const URL_BASE = "http://127.0.0.1:8000";

// utils/api.js
async function http(path, init = {}) {
  const userTok = getUserToken?.();
  const clientTok = getClientToken?.();

  // init.audience: 'user' | 'client' | 'any' (default: 'user')
  const audience = init.audience || "user";
  const chosen =
    audience === "client"
      ? clientTok
      : audience === "any"
      ? userTok || clientTok
      : userTok;

  // monte headers SEM perder o Authorization depois
  const base = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };
  const headers =
    chosen && !base.Authorization
      ? { ...base, Authorization: `Bearer ${chosen}` }
      : base;

  const { audience: _omit, ...rest } = init;

  const res = await fetch(`${URL_BASE}${path}`, {
    method: rest.method || "GET",
    headers,
    ...(rest.body ? { body: rest.body } : {}),
    ...rest,
    // importante: não deixar algum init.headers sobrescrever os headers acima
    headers, // força nossos headers por último
  });

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {}
    const msg =
      payload?.detail || payload?.message || (await res.text().catch(() => ""));
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
  activeRoulette: () =>
    http("/active-roulette", { method: "GET", audience: "user" }),
  updateActiveRoulette: (body) =>
    http("/active-roulette", {
      method: "PUT",
      body: JSON.stringify(body),
      audience: "user",
    }),
  me: () => http("/me", { method: "GET", audience: "user" }),

  //client
  clientLogin: (body) =>
    http("/login-client", {
      method: "POST",
      body: JSON.stringify(body),
      audience: "client",
    }),
  createClient: (body) =>
    http("/clients", {
      method: "POST",
      body: JSON.stringify(body),
      audience: "client", // ← usa o client_token
    }),
     meClient: () => http("/me-client", { method: "GET", audience: "client" }),
};
