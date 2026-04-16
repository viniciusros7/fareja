"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PawPrint, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "choose" | "email" | "email_sent";

const CALLBACK_ERRORS: Record<string, string> = {
  auth_failed: "Não foi possível completar o login. Tente novamente.",
  auth: "Não foi possível completar o login. Tente novamente.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(
    callbackError ? (CALLBACK_ERRORS[callbackError] ?? "Erro ao autenticar. Tente novamente.") : null
  );
  const supabase = createClient();

  function getCallbackUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
  }

  async function handleGoogle() {
    setLoadingProvider("google");
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getCallbackUrl() },
    });
    if (error) {
      setError("Não foi possível conectar com o Google. Tente novamente.");
      setLoadingProvider(null);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoadingProvider("email");
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getCallbackUrl() },
    });
    if (error) {
      setError("Não foi possível enviar o link. Verifique o email e tente novamente.");
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
              onClick={handleGoogle}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-earth-200 rounded-xl text-sm font-medium text-earth-800 hover:bg-earth-50 hover:border-earth-300 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loadingProvider === "google" ? "Redirecionando..." : "Entrar com Google"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-earth-200" />
              <span className="text-xs text-earth-400">ou entre com email</span>
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
              <label className="block text-xs font-medium text-earth-600 mb-1.5">
                Seu email
              </label>
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
              {loadingProvider === "email" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar link de acesso
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
