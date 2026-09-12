"use client";

import { useActionState, useState } from "react";
import { signUp, type SignUpState } from "./actions";

type AccountType = "individual" | "business";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-bold text-sub">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`h-[52px] rounded-field bg-soft px-[17px] text-[14.5px] font-semibold text-ink outline-none placeholder:text-sub focus:ring-2 focus:ring-ink ${
          error ? "ring-2 ring-pink-deep" : ""
        }`}
      />
      {error && <span className="text-xs font-semibold text-pink-deep">{error}</span>}
    </label>
  );
}

export function SignUpForm() {
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [intent, setIntent] = useState<"offer" | "hire">("offer");
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(
    signUp,
    {},
  );

  const isBusiness = accountType === "business";
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="account_type" value={accountType} />
      <input type="hidden" name="intent" value={intent} />

      <div className="flex gap-1 rounded-full bg-soft p-1">
        {(["offer", "hire"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setIntent(value)}
            aria-pressed={intent === value}
            className={`h-10 flex-1 rounded-full text-[13px] font-bold ${
              intent === value ? "bg-white text-ink shadow-sm" : "text-sub"
            }`}
          >
            {value === "offer" ? "Offer a skill" : "Hire someone"}
          </button>
        ))}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[12.5px] font-bold text-sub">Register as</legend>
        <div className="flex gap-2.5">
          {(
            [
              ["individual", "Individual", "Under your own name", "bg-blue-tint", "#2e5a78"],
              ["business", "Business", "A registered business", "bg-yellow-tint", "#8a6b1e"],
            ] as const
          ).map(([value, title, hint, tint, stroke]) => {
            const selected = accountType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAccountType(value)}
                aria-pressed={selected}
                className={`flex flex-1 flex-col gap-2.5 rounded-[22px] p-3.5 text-left ${
                  selected ? "border-2 border-ink" : "border border-line"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-[15px] ${tint}`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {value === "individual" ? (
                      <>
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M4.5 20.2a7.7 7.7 0 0 1 15 0" />
                      </>
                    ) : (
                      <>
                        <path d="M12 2.8 4.6 6v6c0 4.6 3.1 8 7.4 9.2 4.3-1.2 7.4-4.6 7.4-9.2V6z" />
                        <path d="m9 12.2 2.2 2.2 4-4.2" />
                      </>
                    )}
                  </svg>
                </span>
                <span className="text-[14.5px] font-extrabold text-ink">{title}</span>
                <span className="text-[11.5px] font-semibold leading-snug text-sub">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {isBusiness && (
        <Field
          label="Business name"
          name="legal_name"
          placeholder="Nairobi Décor & Events"
          error={errors.legal_name}
          autoComplete="organization"
        />
      )}
      <Field
        label={isBusiness ? "Contact person" : "Full name"}
        name="person"
        placeholder={isBusiness ? "Grace Mwangi" : "Amara Kimani"}
        error={errors.person}
        autoComplete="name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={errors.email}
        autoComplete="email"
      />
      <Field
        label={isBusiness ? "Business phone" : "Phone (optional)"}
        name="phone"
        type="tel"
        placeholder="+254 712 345 678"
        error={errors.phone}
        autoComplete="tel"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        error={errors.password}
        autoComplete="new-password"
      />

      {isBusiness && (
        <p className="rounded-[16px] bg-yellow-tint px-3.5 py-3 text-xs font-semibold leading-relaxed text-yellow-deep">
          We&rsquo;ll ask for a quick verification so clients can see a verified badge.
        </p>
      )}

      {state.message && (
        <p className="rounded-[16px] bg-pink-tint px-3.5 py-3 text-[13px] font-semibold text-pink-deep">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-14 rounded-full bg-ink text-[15.5px] font-bold text-white disabled:opacity-60"
      >
        {pending ? "Creating your account…" : "Continue"}
      </button>

      <p className="text-center text-[11.5px] font-semibold leading-relaxed text-sub">
        By continuing you agree to our{" "}
        <a href="/terms" className="underline">Terms</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
