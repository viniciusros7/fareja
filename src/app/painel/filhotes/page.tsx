"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

interface Puppy {
  id: string;
  kennel_id: string;
  name: string;
  breed: string;
  sex: string;
  born_at: string | null;
  price: number | null;
  status: string;
  microchipped: boolean;
  vaccinated: boolean;
  description: string | null;
}

type FormState = {
  name: string;
  breed: string;
  sex: string;
  born_at: string;
  price: string;
  status: string;
  microchipped: boolean;
  vaccinated: boolean;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: "", breed: "", sex: "male", born_at: "",
  price: "", status: "available", microchipped: false, vaccinated: false, description: "",
};

const statusMap: Record<string, { label: string; cls: string }> = {
  available: { label: "Disponível", cls: "bg-forest-50 text-forest-600" },
  reserved: { label: "Reservado", cls: "bg-brand-100 text-brand-600" },
  sold: { label: "Vendido", cls: "bg-earth-100 text-earth-500" },
  upcoming: { label: "Em breve", cls: "bg-blue-50 text-blue-700" },
};

const formatPrice = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function FilhotesPage() {
  const { user } = useUser();
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [kennelId, setKennelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function load() {
      setLoading(true);
      const { data: kennel } = await supabase
        .from("kennels")
        .select("id")
        .eq("owner_id", user!.id)
        .single();

      if (!kennel) {
        setLoading(false);
        return;
      }

      setKennelId(kennel.id);

      const { data } = await supabase
        .from("puppies")
        .select("*")
        .eq("kennel_id", kennel.id)
        .order("created_at", { ascending: false });

      setPuppies(data ?? []);
      setLoading(false);
    }

    load();
  }, [user]);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(p: Puppy) {
    setForm({
      name: p.name,
      breed: p.breed,
      sex: p.sex,
      born_at: p.born_at ?? "",
      price: p.price !== null ? String(p.price) : "",
      status: p.status,
      microchipped: p.microchipped,
      vaccinated: p.vaccinated,
      description: p.description ?? "",
    });
    setEditId(p.id);
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.breed.trim() || !kennelId) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      kennel_id: kennelId,
      name: form.name.trim(),
      breed: form.breed.trim(),
      sex: form.sex,
      born_at: form.born_at || null,
      price: form.price ? Number(form.price) : null,
      status: form.status,
      microchipped: form.microchipped,
      vaccinated: form.vaccinated,
      description: form.description.trim() || null,
    };

    if (editId) {
      const { data, error: err } = await supabase
        .from("puppies")
        .update(payload)
        .eq("id", editId)
        .select()
        .single();

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      setPuppies((prev) => prev.map((p) => (p.id === editId ? data : p)));
    } else {
      const { data, error: err } = await supabase
        .from("puppies")
        .insert(payload)
        .select()
        .single();

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      setPuppies((prev) => [data, ...prev]);
    }

    setSaving(false);
    closeForm();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("puppies").delete().eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    setPuppies((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  const available = puppies.filter((p) => p.status === "available").length;
  const reserved = puppies.filter((p) => p.status === "reserved").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-earth-400" />
      </div>
    );
  }

  if (!kennelId) {
    return (
      <div className="text-center py-16 text-earth-400 text-sm">
        Nenhum canil associado à sua conta.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-earth-900">Filhotes</h2>
          <p className="text-xs text-earth-500">
            {puppies.length} total · {available} disponíveis · {reserved} reservados
          </p>
        </div>
        <button
          onClick={openNew}
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
            <button onClick={closeForm} className="text-earth-400 hover:text-earth-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Nome *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Macho 1 – Thor"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-earth-600 mb-1">Raça *</label>
              <input
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                placeholder="Ex: Golden Retriever"
                className="w-full px-3 py-2 text-sm border border-earth-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              />
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
                min="0"
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
            disabled={saving || !form.name.trim() || !form.breed.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                  {p.microchipped && (
                    <span className="w-5 h-5 rounded-full bg-forest-50 text-forest-500 flex items-center justify-center text-[9px]">μ</span>
                  )}
                  {p.vaccinated && (
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[9px]">V</span>
                  )}
                </div>
                <div className="text-xs text-earth-400 mt-0.5">
                  {p.breed} · {p.sex === "male" ? "Macho" : "Fêmea"}
                  {p.born_at && ` · Nasc: ${new Date(p.born_at).toLocaleDateString("pt-BR")}`}
                </div>
              </div>
              <div className="text-right shrink-0">
                {p.price !== null && (
                  <div className="text-sm font-semibold text-brand-600">{formatPrice(p.price)}</div>
                )}
                <div className="flex gap-1 mt-1 justify-end">
                  <button
                    onClick={() => openEdit(p)}
                    className="w-7 h-7 rounded-lg border border-earth-200 flex items-center justify-center text-earth-500 hover:bg-earth-50"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {deleteConfirm === p.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-red-600 text-white rounded"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-earth-100 text-earth-600 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {puppies.length === 0 && (
          <div className="text-center py-12 text-earth-400 text-sm">
            Nenhum filhote cadastrado ainda.{" "}
            <button onClick={openNew} className="text-brand-600 hover:underline font-medium">
              Adicionar o primeiro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
