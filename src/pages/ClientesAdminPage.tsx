import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/layout/AdminLayout";
import { crearClienteAdmin, obtenerClientes } from "../services/clientes";
import { UserPlus, Users, X } from "lucide-react";
import AdminSectionHeader from "../components/admin/AdminSectionHeader";

type Cliente = {
  id: number;
  nombre_completo?: string;
  email?: string;
  fecha_nacimiento?: string;
  telefono?: string;
};

function ClientesAdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    fecha_nacimiento: "",
    telefono: "",
  });
  const porPagina = 10;

  const cargarClientes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await obtenerClientes(token);
    setClientes(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    obtenerClientes(token).then(setClientes);
  }, []);

  const formatearFecha = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const guardarCliente = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setGuardando(true);
    setError("");
    try {
      await crearClienteAdmin(token, {
        nombre_completo: form.nombre_completo.trim(),
        telefono: form.telefono.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        ...(form.fecha_nacimiento
          ? { fecha_nacimiento: form.fecha_nacimiento }
          : {}),
      });
      setForm({ nombre_completo: "", email: "", fecha_nacimiento: "", telefono: "" });
      setMostrarFormulario(false);
      setPagina(1);
      await cargarClientes();
    } catch (err) {
      setError(
        axios.isAxiosError(err) && typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : "No se pudo crear el cliente.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nombre_completo || ""} ${cliente.email || ""} ${cliente.telefono || ""}`
      .toLowerCase()
      .includes(busqueda.toLowerCase().trim()),
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(clientesFiltrados.length / porPagina),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const clientesPagina = clientesFiltrados.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina,
  );

  return (
    <AdminLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AdminSectionHeader
          eyebrow="Comunidad"
          title="Clientes"
          description="Buscá, consultá o registrá clientes que necesiten ayuda para reservar."
          icon={<Users size={17} />}
          action={
            <button
              onClick={() => {
                setMostrarFormulario((visible) => !visible);
                setError("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700"
            >
              {mostrarFormulario ? <X size={18} /> : <UserPlus size={18} />}
              {mostrarFormulario ? "Cerrar" : "Nuevo cliente"}
            </button>
          }
        />

        {mostrarFormulario && (
          <form onSubmit={guardarCliente} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm sm:p-7">
            <div>
              <h2 className="text-xl font-black text-gray-900">Registrar cliente</h2>
              <p className="mt-1 text-sm text-gray-500">El email y la fecha de nacimiento son opcionales.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-gray-700">Nombre completo
                <input required value={form.nombre_completo} onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })} placeholder="Nombre y apellido" className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal outline-none focus:border-pink-400 focus:bg-white" />
              </label>
              <label className="text-sm font-bold text-gray-700">Teléfono
                <input required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Ej: 1123456789" className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal outline-none focus:border-pink-400 focus:bg-white" />
              </label>
              <label className="text-sm font-bold text-gray-700">Email <span className="font-normal text-gray-400">(opcional)</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="cliente@email.com" className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal outline-none focus:border-pink-400 focus:bg-white" />
              </label>
              <label className="text-sm font-bold text-gray-700">Nacimiento <span className="font-normal text-gray-400">(opcional)</span>
                <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal outline-none focus:border-pink-400 focus:bg-white" />
              </label>
            </div>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={guardando} className="mt-5 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white hover:bg-pink-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Crear cliente"}
            </button>
          </form>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <input
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por nombre, email o teléfono"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
          />
        </div>

        {/* DESKTOP TABLE */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <table className="hidden w-full md:table">
            <thead className="bg-gray-50/80 backdrop-blur">
              <tr className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Nacimiento</th>
                <th className="px-6 py-4 text-left">Teléfono</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {clientesPagina.map((cliente) => (
                <tr key={cliente.id} className="transition hover:bg-gray-50/70">
                  {/* NOMBRE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                        {cliente.nombre_completo?.charAt(0)?.toUpperCase()}
                      </div>

                      <span className="font-semibold text-gray-900">
                        {cliente.nombre_completo}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cliente.email}
                  </td>

                  {/* FECHA */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {cliente.fecha_nacimiento
                      ? formatearFecha(cliente.fecha_nacimiento)
                      : "-"}
                  </td>

                  {/* TELÉFONO */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {cliente.telefono || "Sin teléfono"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MOBILE CARDS */}
          <div className="grid gap-4 p-4 md:hidden">
            {clientesPagina.map((cliente) => (
              <div
                key={cliente.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* TOP */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                    {cliente.nombre_completo?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {cliente.nombre_completo}
                    </p>

                    <p className="text-sm text-gray-500">{cliente.email}</p>
                  </div>
                </div>

                {/* INFO */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div>
                    📅{" "}
                    {cliente.fecha_nacimiento
                      ? formatearFecha(cliente.fecha_nacimiento)
                      : "-"}
                  </div>

                  <div>📞 {cliente.telefono || "Sin teléfono"}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Mostrando {clientesPagina.length} de {clientesFiltrados.length} clientes
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={paginaActual === 1}
                onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="px-2 text-sm font-semibold">
                {paginaActual} / {totalPaginas}
              </span>
              <button
                disabled={paginaActual === totalPaginas}
                onClick={() =>
                  setPagina((actual) => Math.min(totalPaginas, actual + 1))
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ClientesAdminPage;
