// utils/auth.js
export function setUserToken(token, maxAgeSec = 60 * 60) { // 1h padrão
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `user_token=${token}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}
export function getUserToken() {
  const m = document.cookie.match(/(?:^|; )user_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function clearUserToken() {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `user_token=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function setClientToken(token, { days = 7 } = {}) {
  if (!token) return;
  const maxAge = days * 24 * 60 * 60; // seg
  // Cookie (lido pelo middleware)
  document.cookie = `client_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  // Opcional: localStorage (uso no front)
  try { localStorage.setItem("client_token", token); } catch {}
}

export function getClientToken() {
  // tentar cookie primeiro
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|;\s*)client_token=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
    try { return localStorage.getItem("client_token") || null; } catch {}
  }
  return null;
}

export function clearClientToken() {
  // expira cookie
  document.cookie = `client_token=; Path=/; Max-Age=0; SameSite=Lax`;
  try { localStorage.removeItem("client_token"); } catch {}
}