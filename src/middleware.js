// middleware.js
import { NextResponse } from "next/server";

const ZONES = [
  // protege todo /pages/user/* com o cookie de usuário
  { prefix: "/pages/user", tokenCookie: "user_token", loginPath: "/pages/user/signIn" },
  // se houver área do cliente, descomente:
  { prefix: "/pages/client", tokenCookie: "client_token", loginPath: "/pages/client/signInClient" },
];

const PUBLIC_PATHS = [
  "/",
  "/pages/user/signIn",
  "/pages/user/signUp",
  "/pages/user/welcome",
  "/pages/client/signInClient",
  "/pages/client/signUpClient",
  "/pages/client/welcomeClient",
];

function matchZone(pathname) {
  return ZONES.find((z) => pathname.startsWith(z.prefix));
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // libera caminhos públicos
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // se a rota pertence a alguma zona, exige o token correspondente
  const zone = matchZone(pathname);
  if (!zone) return NextResponse.next(); // não é protegida por estas zonas

  const token = req.cookies.get?.(zone.tokenCookie)?.value;
  if (!token) {
    const url = new URL(zone.loginPath, req.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|public).*)"],
};
