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
  const [country, setCountry] = useState<string>("Turkey");
  const perPage = 20;

  const countryList = [
    "Turkey", "United States", "United Kingdom", "Germany", "France", "Canada", "Australia", "Japan", "China", "Italy", "Spain", "Netherlands", "Sweden", "Finland", "India", "Russia", "Brazil", "South Korea", "Switzerland", "Poland", "Greece"
  ];

  useEffect(() => {
  setLoading(true);
  fetch(`/api/universities?country=${encodeURIComponent(country)}`)
    .then((res) => {
      if (!res.ok) throw new Error("API erişim hatası");
      return res.json();
    })
    .then((data) => {
      setUniversities(data);
      setError(null);
      setPage(1);
    })
    .catch(() => {
      setError("Üniversite verileri alınamadı. Lütfen daha sonra tekrar deneyin.");
    })
    .finally(() => setLoading(false));
}, [country]);


  // Filtreleme
  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedUniversities = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="w-full flex flex-col items-center justify-start py-12 m-0 p-0">
      <div className="mb-8 w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <label htmlFor="country" className="font-bold text-primary text-lg flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            Ülke Seç
          </label>
          <select
            id="country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full md:w-1/3 py-3 px-4 border-2 border-primary rounded-lg bg-background text-primary font-semibold focus:ring-2 focus:ring-violet-600 transition-all duration-200 shadow-lg"
          >
            {countryList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label htmlFor="search" className="font-bold text-primary text-lg flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/></svg>
            Üniversite Ara
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Üniversite adı ile filtrele..."
            className="w-full md:w-1/2 py-3 px-4 border-2 border-gradient-to-r from-primary to-violet-500 rounded-lg bg-background text-primary font-semibold focus:ring-2 focus:ring-violet-600 transition-all duration-200 shadow-lg"
          />
        </div>
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
                className="bg-background rounded-2xl shadow-2xl p-6 border-2 border-transparent bg-clip-padding flex flex-col items-start justify-between h-full transition-all hover:scale-[1.05] hover:border-gradient-to-r hover:from-primary hover:to-violet-500 animate-fade-in"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  <h2 className="text-xl font-bold text-primary mb-0">{uni.name}</h2>
                </div>
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
