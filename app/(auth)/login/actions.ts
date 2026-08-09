"use server";

/**
 * Server Actions untuk autentikasi login & logout admin Kinobo.
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginSchemaValues } from "@/lib/validations/auth";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Server Action untuk memproses login admin.
 * Memverifikasi email & password via Supabase Auth, lalu mengecek status admin via RPC `is_admin()`.
 */
export async function loginAction(
  values: LoginSchemaValues
): Promise<ActionResult> {
  const validation = loginSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Data masukan tidak valid" };
  }

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (signInError) {
    return { error: "Email atau password salah" };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun tidak memiliki akses admin" };
  }

  redirect("/admin/produk");
}

/**
 * Server Action untuk memproses logout admin.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
