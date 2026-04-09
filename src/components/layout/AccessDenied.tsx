import Link from "next/link";
import { ShieldOff } from "lucide-react";

interface AccessDeniedProps {
  message?: string;
}

export default function AccessDenied({
  message = "Você não tem permissão para acessar esta página.",
}: AccessDeniedProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <ShieldOff className="w-8 h-8" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-earth-900 mb-2">
        Acesso negado
      </h1>
      <p className="text-sm text-earth-500 max-w-sm mb-6">{message}</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
