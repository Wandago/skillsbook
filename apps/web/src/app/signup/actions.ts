"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type SignUpState = {
  errors?: Record<string, string>;
  message?: string;
};

export async function signUp(
  _previous: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const accountType =
    formData.get("account_type") === "business" ? "business" : "individual";
  const intent = formData.get("intent") === "hire" ? "hire" : "offer";
  const person = String(formData.get("person") ?? "").trim();
  const legalName = String(formData.get("legal_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const isBusiness = accountType === "business";
  const errors: Record<string, string> = {};

  if (isBusiness && !legalName) errors.legal_name = "Enter your business name.";
  if (!person) {
    errors.person = isBusiness
      ? "Who should we contact about this account?"
      : "Enter your name.";
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = "Enter an email we can reach you on.";
  }
  if (isBusiness && !phone) errors.phone = "Clients will need a number to call.";
  if (password.length < 8) errors.password = "Use at least 8 characters.";

  if (Object.keys(errors).length > 0) return { errors };

  if (!isSupabaseConfigured) {
    return { message: "Supabase is not connected yet — see the README setup steps." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
      data: {
        account_type: accountType,
        // what the public sees: a business trades under its registered name
        display_name: isBusiness ? legalName : person,
        legal_name: isBusiness ? legalName : null,
        contact_name: isBusiness ? person : null,
        phone: phone || null,
        intent,
      },
    },
  });

  if (error) return { message: error.message };

  redirect("/signup/check-email");
}
