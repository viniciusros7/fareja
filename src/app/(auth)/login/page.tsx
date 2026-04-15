"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "choose" | "email" | "email_sent";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | "azure" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleOAuth(provider: "google" | "apple" | "azure") {
    const callbackUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    setLoadingProvider(provider);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      setError("Erro ao conectar. Tente novamente.");
      setLoadingProvider(null);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const callbackUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    setLoadingProvider("email");
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl },
    });
    if (error) {
      setError("Erro ao enviar o link. Verifique o email e tente novamente.");
      setLoadingProvider(null);
      return;
    }
    setMode("email_sent");
    setLoadingProvider(null);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Entre na Fareja
          </h1>
          <p className="text-sm text-earth-500">
            {mode === "email_sent"
              ? `Link enviado para ${email}`
              : "Encontre canis verificados e conecte-se com a comunidade."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* ── Email sent confirmation ── */}
        {mode === "email_sent" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-earth-600 leading-relaxed">
              Enviamos um link de acesso para <strong>{email}</strong>.
              Clique no link para entrar — não precisa de senha.
            </p>
            <button
              onClick={() => { setMode("email"); setEmail(""); }}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Usar outro email
            </button>
          </div>
        )}

        {/* ── Auth Methods ── */}
        {mode === "choose" && (
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-800 hover:bg-earth-50 hover:border-earth-300 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loadingProvider === "google" ? "Redirecionando..." : "Entrar com Google"}
            </button>

            {/* Apple */}
            <button
              onClick={() => handleOAuth("apple")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-800 hover:bg-earth-50 hover:border-earth-300 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.378-3.067c.7-.852 1.17-2.04 1.04-3.229-1.007.04-2.228.671-2.95 1.523-.65.754-1.22 1.963-1.066 3.12 1.12.086 2.262-.572 2.976-1.414z" />
              </svg>
              {loadingProvider === "apple" ? "Redirecionando..." : "Entrar com Apple"}
            </button>

            {/* Microsoft */}
            <button
              onClick={() => handleOAuth("azure")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-800 hover:bg-earth-50 hover:border-earth-300 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <rect x="1"  y="1"  width="10" height="10" fill="#F25022" />
                <rect x="13" y="1"  width="10" height="10" fill="#7FBA00" />
                <rect x="1"  y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
              {loadingProvider === "azure" ? "Redirecionando..." : "Entrar com Microsoft"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-earth-200" />
              <span className="text-xs text-earth-400">ou</span>
              <div className="flex-1 h-px bg-earth-200" />
            </div>

            <button
              onClick={() => setMode("email")}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4" />
              Continuar com email
            </button>
          </div>
        )}

        {/* ── Email Form ── */}
        {mode === "email" && (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-earth-400 leading-relaxed">
              Vamos enviar um link de acesso para o seu email. Sem senha necessária.
            </p>
            <button
              type="submit"
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === "email" ? "Enviando..." : "Enviar link de acesso"}
              {loadingProvider !== "email" && <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMode("choose")}
              className="w-full text-center text-xs text-earth-500 hover:text-brand-600 transition-colors py-2"
            >
              ← Voltar às opções
            </button>
          </form>
        )}

        {mode !== "email_sent" && (
          <p className="text-center text-xs text-earth-400 mt-6 leading-relaxed">
            Ao continuar, você concorda com os{" "}
            <Link href="/termos" className="text-brand-600 hover:underline">Termos de Uso</Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="text-brand-600 hover:underline">Política de Privacidade</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
