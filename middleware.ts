/**
 * Root middleware Next.js — refresh session Supabase Auth di setiap request.
 */
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match semua path kecuali static assets dan image optimization:
     * - _next/static, _next/image, favicon.ico, file dengan ekstensi
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
