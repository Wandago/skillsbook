import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Category = {
  id: string;
  slug: string;
  name: string;
  accent: string;
};

const ACCENTS: Record<string, { base: string; tint: string }> = {
  pink: { base: "#FF7EAE", tint: "#FFE7EF" },
  blue: { base: "#6FCBFF", tint: "#E2F4FF" },
  yellow: { base: "#FFCF56", tint: "#FFF3D4" },
  green: { base: "#7EE8A8", tint: "#E3F9EC" },
  purple: { base: "#B79BFF", tint: "#EFE9FF" },
};

async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, accent")
    .order("sort_order");
  return data ?? [];
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#141414]">
            <div className="h-3 w-3 rounded-[4px] bg-[#FF7EAE]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Skillsbook</span>
        </div>
        <a
          href="/signup"
          className="flex h-11 items-center rounded-full bg-[#141414] px-5 text-sm font-bold text-white"
        >
          List your skill
        </a>
      </header>

      <section className="py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#FF7EAE]">
          Nairobi
        </p>
        <h1 className="mt-4 max-w-[15ch] text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Find someone for anything.
        </h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[#5C564C]">
          Photographers, tailors, tutors, electricians, caterers — browse real
          portfolios and message them directly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">Browse by category</h2>
        {categories.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => {
              const accent = ACCENTS[category.accent] ?? ACCENTS.pink;
              return (
                <a
                  key={category.id}
                  href={`/c/${category.slug}`}
                  className="flex flex-col gap-4 rounded-3xl p-5"
                  style={{ background: accent.tint }}
                >
                  <div
                    className="h-11 w-11 rounded-2xl"
                    style={{ background: accent.base }}
                  />
                  <span className="text-[15px] font-extrabold">{category.name}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[#F2F2EF] p-8">
            <p className="text-[15px] font-bold">No categories yet</p>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[#5C564C]">
              {isSupabaseConfigured
                ? "Run the migration and seed in supabase/ to populate this list."
                : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then reload."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
