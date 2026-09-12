import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your account — Skillsbook",
};

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-5 py-10 sm:py-16">
      <Link href="/" className="mb-10 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink">
          <span className="h-3 w-3 rounded-[4px] bg-pink" />
        </span>
        <span className="text-xl font-extrabold tracking-tight text-ink">Skillsbook</span>
      </Link>

      <h1 className="text-[27px] font-extrabold tracking-tight text-ink">
        Create your account
      </h1>
      <p className="mt-1.5 mb-6 text-[13.5px] font-semibold leading-snug text-body">
        Free to join — you can change this later.
      </p>

      <SignUpForm />
    </main>
  );
}
