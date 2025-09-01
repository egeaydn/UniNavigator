"use client";
import { useEffect, useState } from "react";
import { Listbox } from "@heroui/listbox";



import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import Footer from "@/components/footer";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-24 min-h-screen">
        <div className="inline-block max-w-2xl text-center justify-center animate-fade-in">
          <span className={title({ color: "foreground", class: "drop-shadow-lg text-primary" })}>Türkiye'nin&nbsp;</span>
          <span className={title({ color: "violet", class: "drop-shadow-lg" })}>Üniversiteleri&nbsp;</span>
          <br />
          <span className={title({ color: "foreground", class: "drop-shadow-lg text-primary" })}>
            Modern, hızlı ve şık bir arayüzle keşfet.
          </span>
          <div className={subtitle({ class: "mt-4 text-default-500" })}>
            HeroUI + Next.js + Clerk + Sanity ile profesyonel deneyim.
          </div>
        </div>

        <div className="flex gap-6 justify-center mt-6">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              class: "text-lg px-8 py-3 font-bold"
            })}
            href={siteConfig.links.docs}
          >
            Dokümantasyon
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full", class: "text-lg px-8 py-3 font-bold" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={24} />
            GitHub
          </Link>
        </div>

        <div className="mt-12 w-full flex flex-col items-center">
          <Snippet hideCopyButton hideSymbol variant="bordered" className="mb-8 bg-background text-primary border-primary">
            <span>
              <Code color="primary">Türkiye'deki üniversiteleri seç, detaylarını incele!</Code>
            </span>
          </Snippet>
          {/* Üniversiteler API entegrasyonu */}
          <UniversitySelect />
        </div>
      </section>
      <Footer />
    </>
  );
}


type University = {
  name: string;
  web_pages: string[];
  country: string;
};

function UniversitySelect() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 20;

  useEffect(() => {
    setLoading(true);
    fetch("http://universities.hipolabs.com/search?country=Turkey")
      .then((res) => {
        if (!res.ok) throw new Error("API erişim hatası");
        return res.json();
      })
      .then((data) => {
        setUniversities(data);
        setError(null);
      })
      .catch(() => {
        setError("Üniversite verileri alınamadı. Lütfen daha sonra tekrar deneyin.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtreleme
  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedUniversities = filtered.slice((page - 1) * perPage, page * perPage);

  return (
  <div className="w-full flex flex-col items-center justify-start py-12 m-0 p-0">
      <div className="mb-8 w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <label htmlFor="search" className="font-bold  text-lg">Üniversite Ara</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Üniversite adı ile filtrele..."
          className="w-full md:w-1/2 py-3 px-4 border-2 border-violet-400 rounded-lg bg-white text-violet-900 font-semibold focus:ring-2 focus:ring-violet-600"
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-violet-700 animate-pulse">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Yükleniyor...
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center py-4 border border-red-200 rounded bg-red-50">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mx-auto">
            {pagedUniversities.map((uni, idx) => (
              <div
                key={uni.name}
                className="bg-background rounded-2xl shadow-xl p-6 border border-default-200 flex flex-col items-start justify-between h-full transition-all hover:scale-[1.03] animate-fade-in"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <h2 className="text-xl font-bold text-primary mb-2">{uni.name}</h2>
                <p className="text-md text-default-700 mb-2">{uni.country}</p>
                <a href={uni.web_pages[0]} target="_blank" rel="noopener noreferrer" className="text-primary underline font-semibold hover:text-violet-600 transition-colors">
                  Web Sitesi
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-8 w-full max-w-4xl mx-auto gap-4">
             <button
              className="px-5 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-violet-700 transition-colors disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Önceki
            </button>
            <span className="font-semibold text-default-700 text-lg">Sayfa {page} / {totalPages}</span>
            <button
              className="px-5 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-violet-700 transition-colors disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sonraki →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
