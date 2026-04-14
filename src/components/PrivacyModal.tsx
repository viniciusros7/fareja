"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

export default function PrivacyModal() {
  const { user, loading } = useUser();
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("privacy_accepted")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data && !data.privacy_accepted) {
          setVisible(true);
        }
      });
  }, [user, loading]);

  async function handleAccept() {
    if (!accepted || !user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        privacy_accepted: true,
        privacy_accepted_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setVisible(false);
    setSaving(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-semibold text-earth-900">
            Política de Privacidade
          </h2>
        </div>

        <p className="text-sm text-earth-600 leading-relaxed mb-4">
          Antes de continuar, precisamos que você leia e aceite nossa{" "}
          <Link
            href="/privacidade"
            target="_blank"
            className="text-brand-600 hover:underline font-medium"
          >
            Política de Privacidade
          </Link>
          . Ela descreve como coletamos, usamos e protegemos seus dados de acordo com a{" "}
          <strong>LGPD (Lei Geral de Proteção de Dados)</strong>.
        </p>

        <label className="flex items-start gap-3 cursor-pointer mb-5">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-earth-300 text-brand-600 focus:ring-brand-400"
          />
          <span className="text-sm text-earth-700">
            Li e aceito a{" "}
            <Link
              href="/privacidade"
              target="_blank"
              className="text-brand-600 hover:underline font-medium"
            >
              Política de Privacidade
            </Link>{" "}
            da Fareja
          </span>
        </label>

        <button
          onClick={handleAccept}
          disabled={!accepted || saving}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
            accepted && !saving
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "bg-earth-200 text-earth-400 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Aceitar e continuar"
          )}
        </button>
      </div>
    </div>
  );
}
