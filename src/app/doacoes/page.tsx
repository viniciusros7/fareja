"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, MapPin, CheckCircle2, AlertCircle, PawPrint,
  Plus, X, ChevronDown, User, Building2, Lock,
} from "lucide-react";
import { mockDonations } from "@/lib/mock-data";
import type { Donation } from "@/types";

const allBreeds = [
  "Golden Retriever", "Beagle", "Labrador Retriever", "Shih Tzu",
  "Lhasa Apso", "Maltês", "Pastor Alemão", "Malinois",
  "Bulldog Francês", "Pug", "Border Collie", "Yorkshire Terrier",
  "Poodle", "Rottweiler", "Spitz Alemão",
];

const allStates = ["SP", "PR", "MG", "RJ", "RS", "SC", "BA", "PE", "CE", "GO"];

// Simulação simples de sessão — sem auth real
const IS_LOGGED_IN = false;

function LoginGate() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-brand-600" />
        </div>
        <h2 className="font-display text-xl font-semibold text-brand-900 mb-2">
          Cadastro obrigatório
        </h2>
        <p className="text-sm text-earth-500 leading-relaxed mb-6">
          Para visualizar e cadastrar doações, é necessário ter uma conta na Fareja.
          Isso garante segurança para os animais e transparência no processo.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
        >
          <PawPrint className="w-4 h-4" />
          Criar conta ou entrar
        </Link>
        <p className="mt-4 text-xs text-earth-400">
          É rápido e gratuito para tutores.
        </p>
      </div>
    </div>
  );
}

function DonationCard({ donation }: { donation: Donation }) {
  return (
    <div className="rounded-xl border border-earth-200 bg-white overflow-hidden card-hover">
      <div className="relative h-44">
        <Image
          src={`https://placedog.net/400/200?id=${donation.image_id}`}
          alt={donation.dog_name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {donation.donor_type === "kennel" && donation.kennel_verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-500 text-white">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Criador verificado
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            donation.sex === "male" ? "bg-blue-500 text-white" : "bg-pink-500 text-white"
          }`}>
            {donation.sex === "male" ? "Macho" : "Fêmea"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-earth-900">{donation.dog_name}</h3>
          <span className="text-xs text-earth-400">{donation.age}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
            {donation.breed}
          </span>
        </div>

        {donation.donor_type === "kennel" ? (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-forest-600">
            <Building2 className="w-3 h-3" />
            <span className="font-medium">{donation.kennel_name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-earth-500">
            <User className="w-3 h-3" />
            <span>Pessoa física</span>
          </div>
        )}

        <p className="text-xs text-earth-500 leading-relaxed mb-3 line-clamp-2">
          {donation.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-earth-100">
          <div className="flex items-center gap-1 text-xs text-earth-400">
            <MapPin className="w-3 h-3" />
            {donation.city}, {donation.state}
          </div>
          <a
            href={`tel:${donation.contact}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Heart className="w-3 h-3" />
            Tenho interesse
          </a>
        </div>
      </div>
    </div>
  );
}

function CadastroModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    dog_name: "", breed: "", age: "", sex: "", city: "", state: "",
    reason: "", description: "", contact: "", donor_type: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-earth-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-900">Cadastrar doação</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-earth-100 text-earth-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Aviso */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium leading-relaxed">
              Apenas doações. Vendas não são permitidas nesta seção. Qualquer anúncio com pedido de valor será removido e o usuário poderá ser banido.
            </p>
          </div>

          {/* Tipo de doador */}
          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Você é</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "individual", label: "Pessoa física", icon: User },
                { v: "kennel", label: "Criador / Canil", icon: Building2 },
              ].map(({ v, label, icon: Icon }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("donor_type", v)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.donor_type === v
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-earth-200 text-earth-600 hover:border-earth-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Nome do cão</label>
              <input
                value={form.dog_name}
                onChange={(e) => set("dog_name", e.target.value)}
                placeholder="Ex: Rex"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-earth-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Raça</label>
              <div className="relative">
                <select
                  value={form.breed}
                  onChange={(e) => set("breed", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none"
                >
                  <option value="">Selecionar</option>
                  {allBreeds.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Idade</label>
              <input
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="Ex: 3 anos"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Sexo</label>
              <div className="relative">
                <select
                  value={form.sex}
                  onChange={(e) => set("sex", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none"
                >
                  <option value="">-</option>
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1.5">Estado</label>
              <div className="relative">
                <select
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none"
                >
                  <option value="">UF</option>
                  {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Cidade</label>
            <input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Ex: São Paulo"
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Motivo da doação</label>
            <input
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
              placeholder="Ex: Aposentado da reprodução, mudança, alergia..."
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Descrição do cão</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Conte sobre o temperamento, vacinação, castração, necessidades especiais..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1.5">Contato (telefone ou email)</label>
            <input
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
              placeholder="(11) 99999-0000 ou email@exemplo.com"
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400/30 placeholder:text-earth-300"
            />
          </div>

          <div className="p-3 rounded-xl bg-earth-50 border border-earth-200">
            <p className="text-xs text-earth-500 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-earth-400" />
              O cadastro será revisado pela equipe Fareja antes de ser publicado.
              Doações de criadores verificados recebem badge de destaque.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Enviar para análise
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoacoesPage() {
  const [showModal, setShowModal] = useState(false);
  const [breedFilter, setBreedFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [donorFilter, setDonorFilter] = useState<"all" | "kennel" | "individual">("all");

  if (!IS_LOGGED_IN) return <LoginGate />;

  const filtered = mockDonations.filter((d) => {
    if (breedFilter && d.breed !== breedFilter) return false;
    if (stateFilter && d.state !== stateFilter) return false;
    if (donorFilter !== "all" && d.donor_type !== donorFilter) return false;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900 mb-1">
            Doações
          </h1>
          <p className="text-sm text-earth-500">
            Cães disponíveis para adoção — criadores responsáveis e tutores que precisam de ajuda.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Cadastrar
        </button>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 mb-5 mt-4">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 font-medium">
          Apenas doações. Vendas não são permitidas nesta seção.
          Qualquer anúncio com pedido de valor será removido imediatamente.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Donor type */}
        {(["all", "kennel", "individual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setDonorFilter(t)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              donorFilter === t
                ? "bg-brand-100 text-brand-600 border-brand-300"
                : "bg-white text-earth-500 border-earth-200 hover:bg-earth-50"
            }`}
          >
            {t === "all" ? "Todos" : t === "kennel" ? "Criadores" : "Pessoas físicas"}
          </button>
        ))}

        <div className="relative">
          <select
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            className="pl-3 pr-7 py-1.5 text-xs border border-earth-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none text-earth-600"
          >
            <option value="">Todas as raças</option>
            {allBreeds.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-earth-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="pl-3 pr-7 py-1.5 text-xs border border-earth-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30 appearance-none text-earth-600"
          >
            <option value="">Todos os estados</option>
            {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-earth-400 pointer-events-none" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((d) => <DonationCard key={d.id} donation={d} />)}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <PawPrint className="w-8 h-8 text-earth-300 mx-auto mb-3" />
            <p className="text-sm text-earth-400">Nenhuma doação encontrada com esses filtros.</p>
          </div>
        )}
      </div>

      {showModal && <CadastroModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
