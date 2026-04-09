"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Star, AlertCircle, Upload,
  ChevronDown, ShieldCheck, PawPrint,
} from "lucide-react";

// ─── Dados dos campos ───────────────────────────────────────────────

const required = [
  {
    id: "kc_registry",
    label: "Registro CBKC / SOBRACI / FCI",
    desc: "Número do registro e upload do documento oficial.",
    hasUpload: true,
    placeholder: "Ex: CBKC #12345",
  },
  {
    id: "pedigree",
    label: "Pedigree dos reprodutores",
    desc: "Upload do pedigree de todos os reprodutores ativos.",
    hasUpload: true,
    placeholder: null,
  },
  {
    id: "vaccines",
    label: "Protocolo vacinal completo",
    desc: "V8/V10 + Antirrábica de todos os reprodutores.",
    hasUpload: true,
    placeholder: null,
  },
  {
    id: "microchip",
    label: "Microchipagem dos reprodutores",
    desc: "Certificado de microchipagem de cada reprodutor.",
    hasUpload: true,
    placeholder: null,
  },
  {
    id: "photos",
    label: "Fotos das instalações",
    desc: "Mínimo de 5 fotos mostrando canis, área de socialização e higiene.",
    hasUpload: true,
    placeholder: null,
  },
  {
    id: "vet",
    label: "Veterinário responsável",
    desc: "Nome completo e número do CRMV.",
    hasUpload: false,
    placeholder: "Dr. João Silva – CRMV-SP 12345",
  },
  {
    id: "min_age",
    label: "Declaração de idade mínima de entrega",
    desc: "Confirmação de que filhotes não são entregues antes de 45 dias.",
    hasUpload: true,
    placeholder: null,
  },
  {
    id: "contract",
    label: "Modelo de contrato de venda",
    desc: "Upload do contrato padrão utilizado nas vendas.",
    hasUpload: true,
    placeholder: null,
  },
];

const recommended = [
  { id: "dysplasia_hip", label: "Teste de displasia coxofemoral (RX com laudo)" },
  { id: "dysplasia_elbow", label: "Teste de displasia de cotovelo" },
  { id: "cardiac", label: "Exame cardíaco" },
  { id: "ophthalmic", label: "Exame oftalmológico" },
  { id: "dna", label: "Testes genéticos / DNA" },
  { id: "socialization", label: "Programa de socialização documentado" },
  { id: "titles", label: "Títulos em exposições CBKC / FCI" },
  { id: "experience", label: "Mais de 3 anos de atividade comprovada" },
];

const rejectionRules = [
  "Sem registro em entidade reconhecida (CBKC, SOBRACI ou FCI)",
  "Reprodutores sem pedigree registrado",
  "Filhotes entregues com menos de 45 dias de vida",
  "Sem acompanhamento veterinário documentado",
];

// ─── Componente ────────────────────────────────────────────────────

export default function CadastroPage() {
  const [reqValues, setReqValues] = useState<Record<string, string>>({});
  const [reqFiles, setReqFiles] = useState<Record<string, boolean>>({});
  const [recChecked, setRecChecked] = useState<Record<string, boolean>>({});

  const completedReq = required.filter((r) => {
    if (r.hasUpload && r.placeholder) return reqValues[r.id]?.trim() && reqFiles[r.id];
    if (r.hasUpload) return reqFiles[r.id];
    return reqValues[r.id]?.trim();
  }).length;

  const completedRec = Object.values(recChecked).filter(Boolean).length;

  const allRequiredDone = completedReq === required.length;

  function toggleRec(id: string) {
    setRecChecked((p) => ({ ...p, [id]: !p[id] }));
  }

  function markFile(id: string) {
    setReqFiles((p) => ({ ...p, [id]: true }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/para-criadores"
        className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-brand-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para criadores
      </Link>

      <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
        Cadastro de canil
      </h1>
      <p className="text-sm text-earth-500 mb-6">
        Preencha todos os campos obrigatórios para solicitar verificação.
      </p>

      {/* ─── Barra de progresso ─── */}
      <div className="p-4 rounded-2xl border border-earth-200 bg-white mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-earth-700">
                Obrigatórios
              </span>
              <span className={`font-semibold ${allRequiredDone ? "text-forest-600" : "text-earth-500"}`}>
                {completedReq}/{required.length} {allRequiredDone ? "✅" : ""}
              </span>
            </div>
            <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${(completedReq / required.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-earth-700">
                Recomendados
              </span>
              <span className="font-semibold text-brand-600">
                {completedRec}/{recommended.length} ⭐
              </span>
            </div>
            <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-300"
                style={{ width: `${(completedRec / recommended.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        {!allRequiredDone && (
          <p className="text-xs text-earth-400">
            Complete todos os itens obrigatórios para liberar o envio.
          </p>
        )}
        {allRequiredDone && (
          <p className="text-xs text-forest-600 font-medium">
            Todos os obrigatórios preenchidos! Adicione os diferenciais recomendados para fortalecer seu cadastro.
          </p>
        )}
      </div>

      {/* ─── Rejeição automática ─── */}
      <div className="p-4 rounded-2xl border border-red-200 bg-red-50 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-semibold text-red-700">Motivos de rejeição automática</h3>
        </div>
        <ul className="space-y-1.5">
          {rejectionRules.map((r) => (
            <li key={r} className="flex items-start gap-2 text-xs text-red-600">
              <span className="mt-0.5 shrink-0">✗</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Dados básicos ─── */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider mb-4">
          Dados do canil
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Nome do canil</label>
            <input
              type="text"
              placeholder="Ex: Canil Boa Vida"
              className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Cidade</label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Estado</label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none text-earth-700">
                  <option value="">Selecionar</option>
                  {["SP","PR","MG","RJ","RS","SC","BA","PE","CE","GO"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Raças criadas</label>
            <input
              type="text"
              placeholder="Ex: Golden Retriever, Beagle"
              className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Telefone</label>
              <input
                type="tel"
                placeholder="(11) 99999-0000"
                className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="contato@canil.com.br"
                className="w-full px-3 py-2.5 text-sm border border-earth-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Obrigatórios ─── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider">
            Documentação obrigatória
          </h2>
        </div>
        <div className="space-y-4">
          {required.map((r, idx) => {
            const isDone = r.hasUpload && r.placeholder
              ? reqValues[r.id]?.trim() && reqFiles[r.id]
              : r.hasUpload
              ? reqFiles[r.id]
              : reqValues[r.id]?.trim();

            return (
              <div
                key={r.id}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  isDone ? "border-forest-300 bg-forest-50/40" : "border-earth-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isDone ? "bg-forest-500 text-white" : "bg-earth-100 text-earth-500"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-earth-800 mb-0.5">{r.label}</div>
                    <div className="text-xs text-earth-500 mb-2">{r.desc}</div>

                    {r.placeholder && (
                      <input
                        type="text"
                        placeholder={r.placeholder}
                        value={reqValues[r.id] ?? ""}
                        onChange={(e) => setReqValues((p) => ({ ...p, [r.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300 mb-2"
                      />
                    )}

                    {r.hasUpload && (
                      <button
                        type="button"
                        onClick={() => markFile(r.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          reqFiles[r.id]
                            ? "border-forest-300 bg-forest-50 text-forest-700"
                            : "border-earth-200 bg-white text-earth-600 hover:bg-earth-50"
                        }`}
                      >
                        {reqFiles[r.id] ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Arquivo enviado</>
                        ) : (
                          <><Upload className="w-3.5 h-3.5" /> Selecionar arquivo</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Recomendados ─── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-brand-400" />
          <h2 className="text-xs font-semibold text-earth-400 uppercase tracking-wider">
            Diferenciais recomendados
          </h2>
        </div>
        <p className="text-xs text-earth-500 mb-4">
          Não são obrigatórios, mas aumentam a confiança dos compradores e elevam a sua classificação na plataforma.
        </p>
        <div className="space-y-2">
          {recommended.map((r) => (
            <label
              key={r.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                recChecked[r.id]
                  ? "border-brand-300 bg-brand-50/40"
                  : "border-earth-200 bg-white hover:border-earth-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                recChecked[r.id] ? "bg-brand-600 border-brand-600" : "border-earth-300"
              }`}>
                {recChecked[r.id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!recChecked[r.id]}
                onChange={() => toggleRec(r.id)}
              />
              <span className="text-sm text-earth-700">{r.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ─── Submit ─── */}
      <div className="sticky bottom-4">
        <div className={`p-4 rounded-2xl border shadow-lg shadow-earth-900/5 ${
          allRequiredDone
            ? "bg-white border-forest-300"
            : "bg-white border-earth-200"
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 text-sm">
              <span className={`font-semibold ${allRequiredDone ? "text-forest-700" : "text-earth-600"}`}>
                {completedReq}/{required.length} obrigatórios
              </span>
              <span className="text-earth-400 mx-2">·</span>
              <span className="text-brand-600 font-semibold">{completedRec}/{recommended.length} diferenciais</span>
            </div>
          </div>
          <button
            disabled={!allRequiredDone}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
              allRequiredDone
                ? "bg-brand-600 text-white hover:bg-brand-700"
                : "bg-earth-200 text-earth-400 cursor-not-allowed"
            }`}
          >
            <PawPrint className="w-4 h-4" />
            {allRequiredDone ? "Enviar para análise" : `Faltam ${required.length - completedReq} itens obrigatórios`}
          </button>
        </div>
      </div>
    </div>
  );
}
