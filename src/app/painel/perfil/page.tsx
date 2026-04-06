"use client";

import { useState } from "react";
import { Save, Camera, CheckCircle2, Gem } from "lucide-react";

export default function PerfilPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Canil Good Leisure",
    description: "Criamos com amor desde 1988. Com mais de 37 anos de experiência, somos referência na criação de Golden Retrievers e Beagles em São Paulo. Nossos cuidadores, Fábio e Marli, dedicam a vida a garantir filhotes saudáveis, bem socializados e com genética de excelência.",
    city: "São Lourenço da Serra",
    state: "SP",
    phone: "(11) 99999-0001",
    email: "contato@canilgoodleisure.com.br",
    instagram: "@canilgoodleisure",
    website: "",
    kc_registry: "CBKC #1204",
    years_active: "37",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-earth-900">Perfil do canil</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-700 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Perfil salvo com sucesso!
        </div>
      )}

      {/* Logo/Cover upload */}
      <div className="p-5 rounded-xl border border-earth-200 bg-white space-y-4">
        <h3 className="text-sm font-semibold text-earth-700">Imagens</h3>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold mb-2 cursor-pointer hover:bg-brand-200 transition-colors">
              GL
            </div>
            <button className="text-xs text-brand-600 font-medium flex items-center gap-1 mx-auto">
              <Camera className="w-3 h-3" /> Logo
            </button>
          </div>
          <div className="flex-1">
            <div className="w-full h-20 rounded-xl bg-earth-100 flex items-center justify-center cursor-pointer hover:bg-earth-200 transition-colors">
              <span className="text-xs text-earth-400 flex items-center gap-1">
                <Camera className="w-3 h-3" /> Foto de capa (1200x400)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="p-5 rounded-xl border border-earth-200 bg-white space-y-4">
        <h3 className="text-sm font-semibold text-earth-700">Informações básicas</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Nome do canil</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Registro Kennel Club</label>
            <input
              value={form.kc_registry}
              disabled
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-earth-50 text-earth-500"
            />
            <span className="text-[10px] text-earth-400">Não pode ser alterado. Contate o admin.</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Cidade</label>
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Estado</label>
            <select
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
            >
              {["SP", "PR", "MG", "RJ", "RS", "SC", "BA", "PE", "CE", "GO"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Anos de atividade</label>
            <input
              type="number"
              value={form.years_active}
              onChange={(e) => updateField("years_active", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-earth-600 mb-1">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 resize-none"
            rows={4}
          />
          <span className="text-[10px] text-earth-400">{form.description.length}/500 caracteres</span>
        </div>
      </div>

      {/* Contact */}
      <div className="p-5 rounded-xl border border-earth-200 bg-white space-y-4">
        <h3 className="text-sm font-semibold text-earth-700">Contato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Telefone</label>
            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Instagram</label>
            <input
              value={form.instagram}
              onChange={(e) => updateField("instagram", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Website</label>
            <input
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
        </div>
      </div>

      {/* Plan info */}
      <div className="p-5 rounded-xl border border-brand-200 bg-brand-50/30">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-earth-700">Seu plano</h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white">
            <Gem className="w-2.5 h-2.5" />
            Elite
          </span>
        </div>
        <p className="text-xs text-earth-500 mb-3">
          R$ 350/mês · Fotos ilimitadas · Respostas ilimitadas · Parceiros · Super destaque
        </p>
        <button className="text-xs text-brand-600 font-semibold hover:text-brand-700">
          Gerenciar assinatura →
        </button>
      </div>
    </div>
  );
}
