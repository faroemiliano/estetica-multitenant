import axios from "axios";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Link2,
  Mail,
  Palette,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  crearEstetica,
  type CrearEsteticaBody,
  type EsteticaCreada,
} from "../services/plataforma";

const inicial: CrearEsteticaBody = {
  nombre: "",
  slug: "",
  admin_email: "",
  admin_nombre: "",
  logo_url: "",
  color_primario: "#db2777",
  hero_image: "",
  instagram_url: "",
  whatsapp: "",
  direccion: "",
};

const normalizarSlug = (valor: string) =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const detalleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }
  return "No pudimos crear la estética. Revisá los datos e intentá nuevamente.";
};

function PlataformaEsteticasPage() {
  const [clave, setClave] = useState("");
  const [form, setForm] = useState<CrearEsteticaBody>(inicial);
  const [slugEditado, setSlugEditado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<EsteticaCreada | null>(null);

  const urlEstetica = useMemo(
    () => `${window.location.origin}/${resultado?.slug || form.slug}`,
    [form.slug, resultado?.slug],
  );

  const actualizar = (campo: keyof CrearEsteticaBody, valor: string) => {
    setForm((actual) => {
      const siguiente = { ...actual, [campo]: valor };
      if (campo === "nombre" && !slugEditado) {
        siguiente.slug = normalizarSlug(valor);
      }
      return siguiente;
    });
  };

  const guardar = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setResultado(null);

    if (!clave.trim()) {
      setError("Ingresá la clave de aprovisionamiento.");
      return;
    }

    setGuardando(true);
    try {
      const body = Object.fromEntries(
        Object.entries(form).map(([campo, valor]) => [
          campo,
          typeof valor === "string" ? valor.trim() || undefined : valor,
        ]),
      ) as CrearEsteticaBody;
      body.nombre = form.nombre.trim();
      body.slug = normalizarSlug(form.slug);
      body.admin_email = form.admin_email.trim().toLowerCase();
      setResultado(await crearEstetica(clave.trim(), body));
    } catch (err) {
      setError(detalleError(err));
    } finally {
      setGuardando(false);
    }
  };

  const nuevaEstetica = () => {
    setForm(inicial);
    setSlugEditado(false);
    setResultado(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#faf8f6] text-gray-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-600 text-white">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="font-black">Agenda Bel</p>
              <p className="text-xs font-semibold text-gray-400">Panel de plataforma</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-stone-100 px-4 py-2 text-xs font-bold text-stone-600 sm:block">
            Uso exclusivo del operador
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
            <Building2 size={17} /> Nueva cuenta
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Crear una estética
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-gray-500">
            Generá el espacio, su dirección pública y el primer acceso administrador en una sola operación.
          </p>
        </div>

        {resultado ? (
          <div className="mt-10 max-w-3xl rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-10">
            <CheckCircle2 className="text-emerald-600" size={48} />
            <h2 className="mt-5 text-3xl font-black">Estética creada correctamente</h2>
            <p className="mt-3 text-gray-500">
              El administrador <strong>{resultado.admin_email}</strong> ya puede ingresar con Google desde su nueva página.
            </p>
            <div className="mt-7 rounded-2xl bg-stone-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">URL pública</p>
              <p className="mt-2 break-all font-bold text-pink-700">{urlEstetica}</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={`/${resultado.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white hover:bg-pink-700">
                Abrir estética <ExternalLink size={18} />
              </a>
              <button onClick={nuevaEstetica} className="rounded-xl border border-stone-200 px-5 py-3.5 font-bold text-gray-700 hover:bg-stone-50">
                Crear otra estética
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={guardar} className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-black"><Building2 className="text-pink-600" size={21} /> Identidad</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Nombre *</span><input required value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)} placeholder="Ej. Estética Belgrano" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none focus:border-pink-400 focus:bg-white" /></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">Slug *</span><div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 px-4 focus-within:border-pink-400 focus-within:bg-white"><Link2 size={17} className="shrink-0 text-gray-400" /><input required minLength={2} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(e) => { setSlugEditado(true); actualizar("slug", normalizarSlug(e.target.value)); }} placeholder="estetica-belgrano" className="w-full bg-transparent px-3 py-3 outline-none" /></div><small className="mt-2 block text-gray-400">{urlEstetica}</small></label>
                  <label><span className="mb-2 block text-sm font-bold">Color principal</span><div className="flex gap-3"><input type="color" value={form.color_primario} onChange={(e) => actualizar("color_primario", e.target.value)} className="h-12 w-14 rounded-lg border border-stone-200 bg-white p-1" /><input value={form.color_primario} onChange={(e) => actualizar("color_primario", e.target.value)} className="min-w-0 flex-1 rounded-xl border border-stone-200 px-4" /></div></label>
                  <label><span className="mb-2 block text-sm font-bold">Dirección</span><input value={form.direccion} onChange={(e) => actualizar("direccion", e.target.value)} placeholder="Av. Cabildo 1234" className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">URL del logo</span><input type="url" value={form.logo_url} onChange={(e) => actualizar("logo_url", e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                  <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">URL de imagen principal</span><input type="url" value={form.hero_image} onChange={(e) => actualizar("hero_image", e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="flex items-center gap-2 text-xl font-black"><UserRound className="text-pink-600" size={21} /> Administrador inicial</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label><span className="mb-2 block text-sm font-bold">Nombre</span><input value={form.admin_nombre} onChange={(e) => actualizar("admin_nombre", e.target.value)} placeholder="Nombre y apellido" className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                  <label><span className="mb-2 block text-sm font-bold">Email de Google *</span><div className="flex items-center rounded-xl border border-stone-200 px-4 focus-within:border-pink-400"><Mail size={17} className="shrink-0 text-gray-400" /><input required type="email" value={form.admin_email} onChange={(e) => actualizar("admin_email", e.target.value)} placeholder="admin@email.com" className="min-w-0 flex-1 px-3 py-3 outline-none" /></div></label>
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6">
              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-black"><Palette className="text-pink-600" size={21} /> Contacto</h2>
                <div className="mt-6 space-y-5">
                  <label><span className="mb-2 block text-sm font-bold">WhatsApp</span><input value={form.whatsapp} onChange={(e) => actualizar("whatsapp", e.target.value)} placeholder="5491123456789" className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                  <label><span className="mb-2 block text-sm font-bold">Instagram</span><input type="url" value={form.instagram_url} onChange={(e) => actualizar("instagram_url", e.target.value)} placeholder="https://instagram.com/..." className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-pink-400" /></label>
                </div>
              </section>

              <section className="rounded-3xl border border-pink-200 bg-pink-50 p-6">
                <label><span className="mb-2 flex items-center gap-2 text-sm font-black text-pink-900"><KeyRound size={17} /> Clave de plataforma *</span><input required type="password" autoComplete="off" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="PROVISIONING_KEY" className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-500" /></label>
                <p className="mt-3 text-xs leading-5 text-pink-800/70">La clave se envía una sola vez al backend y no queda guardada en el navegador.</p>
                {error && <p className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
                <button disabled={guardando} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-4 font-black text-white hover:bg-pink-700 disabled:cursor-wait disabled:opacity-60">
                  {guardando ? "Creando..." : "Crear estética"} <ArrowRight size={19} />
                </button>
              </section>
            </aside>
          </form>
        )}
      </section>
    </main>
  );
}

export default PlataformaEsteticasPage;
