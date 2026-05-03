import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/login",
    "/signin",
    "/api/auth",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si la route est publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    // Ajouter le chemin d'origine comme paramètre pour redirection après login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à login/signin, rediriger vers la page d'accueil
  if ((pathname === "/login" || pathname === "/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Configuration du matcher pour exclure les fichiers statiques et les assets Next.js
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth.js routes)
     * - tout /_next/ (static, image, webpack/Turbopack en dev — sinon CSS/JS peut être redirigé vers /login)
     * - favicon.ico
     * - fichiers statiques courants (images, polices, CSS nommé explicitement)
     */
    "/((?!api/auth|_next(?:/|$)|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|woff2?)$).*)",
  ],
};
