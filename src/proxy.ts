import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Primer filtro, barato: ¿hay cookie de sesión?
  //
  // El middleware corre en el Edge y no llega al almacén de sesiones, así que
  // no puede saber si el token es válido. Eso lo resuelve requireAuth() en cada
  // página y en cada acción del panel, que corren en Node y sí lo consultan.
  // Acá alcanza con evitarle el viaje a quien claramente no inició sesión.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = request.cookies.get("flandes_admin");
    if (!cookie?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect socios portal
  if (pathname.startsWith("/socios/portal")) {
    const cookie = request.cookies.get("flandes_socio");
    if (!cookie?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/socios/login";
      return NextResponse.redirect(url);
    }
  }

  // Forward pathname so the root layout can suppress the public nav/footer.
  // Must be set on the request headers (not the response) to be visible to headers() in Server Components.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
