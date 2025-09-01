"use client";
import { useEffect, useState } from "react";
import { Listbox } from "@heroui/listbox";



import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-24 bg-gradient-to-br from-violet-900 via-indigo-900 to-black min-h-screen">
      <div className="inline-block max-w-2xl text-center justify-center animate-fade-in">
        <span className={title({ color: "foreground", class: "drop-shadow-lg text-white" })}>Türkiye'nin&nbsp;</span>
        <span className={title({ color: "violet", class: "drop-shadow-lg" })}>Üniversiteleri&nbsp;</span>
        <br />
        <span className={title({ color: "foreground", class: "drop-shadow-lg text-white" })}>
          Modern, hızlı ve şık bir arayüzle keşfet.
        </span>
        <div className={subtitle({ class: "mt-4 text-gray-200" })}>
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
        <Snippet hideCopyButton hideSymbol variant="bordered" className="mb-8 bg-black/40 text-white border-violet-700">
          <span>
            <Code color="primary">Türkiye'deki üniversiteleri seç, detaylarını incele!</Code>
          </span>
        </Snippet>
        {/* Üniversiteler API entegrasyonu */}
        <UniversitySelect />
      </div>
    </section>
  );
}


type University = {
  name: string;
  web_pages: string[];
  country: string;
};

function UniversitySelect() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
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

  const totalPages = Math.ceil(universities.length / perPage);
  const pagedUniversities = universities.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="w-full max-w-lg mt-12 bg-white/80 rounded-xl shadow-lg p-8 border border-violet-200">
      <label htmlFor="university-select" className="block mb-4 font-bold text-violet-900 text-lg">Üniversite Seçin</label>
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-violet-700 animate-pulse">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Yükleniyor...
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold text-center py-4 border border-red-200 rounded bg-red-50">{error}</div>
      ) : (
        <>
          <select
            id="university-select"
            className="w-full py-3 px-4 border-2 border-violet-400 rounded-lg bg-white text-violet-900 font-semibold focus:ring-2 focus:ring-violet-600"
            value={selectedIndex ?? ""}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            <option value="" disabled>Bir üniversite seçin...</option>
            {pagedUniversities.map((uni, idx) => (
              <option key={uni.name} value={idx}>{uni.name}</option>
            ))}
          </select>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Önceki
            </button>
            <span className="font-semibold text-violet-900">Sayfa {page} / {totalPages}</span>
            <button
              className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sonraki
            </button>
          </div>
          {selectedIndex !== null && pagedUniversities[selectedIndex] && (
            <div className="mt-8 p-6 border-2 border-violet-300 rounded-xl bg-violet-50 shadow">
              <h2 className="text-2xl font-bold text-violet-900 mb-2">{pagedUniversities[selectedIndex].name}</h2>
              <p className="text-md text-violet-700 mb-2">{pagedUniversities[selectedIndex].country}</p>
              <a href={pagedUniversities[selectedIndex].web_pages[0]} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline font-semibold">
                Web Sitesi
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
