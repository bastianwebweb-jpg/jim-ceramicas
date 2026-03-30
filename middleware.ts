import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";



export async function middleware(req) {
  const res = NextResponse.next();
 
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, "", options);
        },
      },
    }
  );

  const {
  data: { session },
  } = await supabase.auth.getSession();

console.log("SESSION:", session);

  // 🔒 proteger /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔥 verificar rol
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    console.log("PROFILE:", profile);

    if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }
    }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};