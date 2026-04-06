"use client";

import { useState } from "react";
import { Plus, Dog, Edit2, Trash2, X, CheckCircle2 } from "lucide-react";

const initialPuppies = [
  { id: "p1", name: "Macho 1 – Golden", breed: "Golden Retriever", sex: "male", born_at: "2026-02-10", price: 5500, status: "available", microchipped: true, vaccinated: true, description: "Pelagem dourada clara, temperamento equilibrado e dócil" },
  { id: "p2", name: "Fêmea 1 – Golden", breed: "Golden Retriever", sex: "female", born_at: "2026-02-10", price: 6000, status: "available", microchipped: true, vaccinated: true, description: "Pelagem dourada escura, muito brincalhona" },
  { id: "p3", name: "Macho 1 – Beagle", breed: "Beagle", sex: "male", born_at: "2026-03-05", price: 4000, status: "available", microchipped: true, vaccinated: true, description: "Tricolor clássico, muito ativo e curioso" },
  { id: "p4", name: "Fêmea 2 – Golden", breed: "Golden Retriever", sex: "female", born_at: "", price: 5500, status: "upcoming", microchipped: false, vaccinated: false, description: "Previsão para junho/2026" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  available: { label: "Disponível", cls: "bg-forest-50 text-forest-600" },
  reserved: { label: "Reservado", cls: "bg-brand-100 text-brand-600" },
  sold: { label: "Vendido", cls: "bg-earth-100 text-earth-500" },
  upcoming: { label: "Em breve", cls: "bg-blue-50 text-blue-700" },
};

const formatPrice = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function FilhotesPage() {
  const [puppies, setPuppies] = useState(initialPuppies);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", breed: "Golden Retriever", sex: "male", born_at: "",
    price: "", status: "available", microchipped: false, vaccinated: false, description: "",
  });

  const resetForm = () => {
    setForm({ name: "", breed: "Golden Retriever", sex: "male", born_at: "", price: "", status: "available", microchipped: false, vaccinated: false, description: "" });
    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (id: string) => {
    const p = puppies.find((x) => x.id === id);
    if (!p) return;
    setForm({ ...p, price: String(p.price) });
    setEditId(id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const puppy = { ...form, price: Number(form.price), id: editId || `p${Date.now()}` };
    if (editId) {
      setPuppies((prev) => prev.map((p) => (p.id === editId ? puppy : p)));
    } else {
      setPuppies((prev) => [...prev, puppy]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPuppies((prev) => prev.filter((p) => p.id !== id));
  };

  const available = puppies.filter((p) => p.status === "available").length;
  const reserved = puppies.filter((p) => p.status === "reserved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-earth-900">Filhotes</h2>
          <p className="text-xs text-earth-500">{puppies.length} total · {available} disponíveis · {reserved} reservados</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar filhote
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 rounded-xl border border-brand-200 bg-brand-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-earth-800">
              {editId ? "Editar filhote" : "Novo filhote"}
            </h3>
            <button onClick={resetForm} className="text-earth-400 hover:text-earth-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Macho 1 – Golden"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Raça</label>
              <select
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
              >
                <option>Golden Retriever</option>
                <option>Beagle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Sexo</label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
              >
                <option value="male">Macho</option>
                <option value="female">Fêmea</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Nascimento</label>
              <input
                type="date"
                value={form.born_at}
                onChange={(e) => setForm({ ...form, born_at: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Preço (R$)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="5500"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white"
              >
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
                <option value="upcoming">Em breve</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-earth-600 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Cor, temperamento, características..."
              className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-earth-600">
              <input
                type="checkbox"
                checked={form.microchipped}
                onChange={(e) => setForm({ ...form, microchipped: e.target.checked })}
                className="rounded"
              />
              Microchipado
            </label>
            <label className="flex items-center gap-2 text-sm text-earth-600">
              <input
                type="checkbox"
                checked={form.vaccinated}
                onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
                className="rounded"
              />
              Vacinado
            </label>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            {editId ? "Salvar alterações" : "Adicionar filhote"}
          </button>
        </div>
      )}

      {/* Puppies list */}
      <div className="space-y-3">
        {puppies.map((p) => {
          const st = statusMap[p.status] ?? statusMap.upcoming;
          return (
            <div key={p.id} className="p-4 rounded-xl border border-earth-200 bg-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center text-lg shrink-0">
                🐕
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-earth-900 truncate">{p.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.cls}`}>
                    {st.label}
                  </span>
                  {p.microchipped && <span className="w-5 h-5 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center text-[9px]">μ</span>}
                  {p.vaccinated && <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px]">V</span>}
                </div>
                <div className="text-xs text-earth-400 mt-0.5">
                  {p.breed} · {p.sex === "male" ? "Macho" : "Fêmea"}
                  {p.born_at && ` · Nasc: ${new Date(p.born_at).toLocaleDateString("pt-BR")}`}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-brand-600">{formatPrice(p.price)}</div>
                <div className="flex gap-1 mt-1 justify-end">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="w-7 h-7 rounded-lg border border-earth-200 flex items-center justify-center text-earth-500 hover:bg-earth-50"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
