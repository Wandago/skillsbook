import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-5 py-16">
      <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-green-tint">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f6b45"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      </span>
      <h1 className="mt-6 text-[27px] font-extrabold tracking-tight text-ink">
        Check your email
      </h1>
      <p className="mt-3 text-[15px] font-semibold leading-relaxed text-body">
        We sent you a link to confirm your address. Open it on this device and
        you&rsquo;ll be signed in.
      </p>
      <Link href="/" className="mt-8 flex h-14 items-center justify-center rounded-full border border-line text-[15px] font-bold text-ink">
        Back to Skillsbook
      </Link>
    </main>
  );
}
