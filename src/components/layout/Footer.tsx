import Link from "next/link";
import { PawPrint, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-earth-200 bg-earth-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-brand-600" />
              </div>
              <span className="font-display text-lg font-semibold text-brand-600">
                Fareja
              </span>
            </div>
            <p className="text-sm text-earth-500 leading-relaxed">
              Procedência que você pode confiar. A primeira plataforma brasileira
              de canis verificados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-earth-800 mb-3">Plataforma</h4>
            <ul className="space-y-2">
              {[
                ["/buscar", "Buscar canis"],
                ["/comunidade", "Comunidade"],
                ["/para-criadores", "Para criadores"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-earth-500 hover:text-brand-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-earth-800 mb-3">Suporte</h4>
            <ul className="space-y-2">
              {[
                ["/suporte",      "Central de ajuda"],
                ["/termos",       "Termos de uso"],
                ["/privacidade",  "Política de privacidade"],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-earth-500 hover:text-brand-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-earth-800 mb-3">Siga a Fareja</h4>
            <a
              href="https://instagram.com/fareja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-100 text-brand-600 rounded-full text-sm font-medium hover:bg-brand-200 transition-colors"
            >
              <AtSign className="w-4 h-4" />
              @fareja
            </a>
            <p className="mt-3 text-xs text-earth-400">
              Dicas, novidades e bastidores dos melhores canis do Brasil.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-earth-200 text-center text-xs text-earth-400">
          © {new Date().getFullYear()} Fareja. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
