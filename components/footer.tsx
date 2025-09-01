import { Link } from "@heroui/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-default-200 py-8 mt-8 flex flex-col items-center text-center">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
        <span className="text-lg font-semibold text-primary">UniNavigator</span>
        <span className="text-default-500">Türkiye'nin üniversitelerini keşfet, karşılaştır, incele.</span>
      </div>
      <div className="flex gap-6 justify-center mb-4">
        <Link isExternal href={siteConfig.links.github} className="text-default-500 hover:text-primary transition-colors">GitHub</Link>
        <Link isExternal href={siteConfig.links.docs} className="text-default-500 hover:text-primary transition-colors">Dokümantasyon</Link>
      </div>
      <span className="text-xs text-default-400">© {new Date().getFullYear()} UniNavigator. Tüm hakları saklıdır.</span>
    </footer>
  );
}
