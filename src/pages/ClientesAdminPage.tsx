import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { obtenerClientes } from "../services/clientes";
import { Users } from "lucide-react";
import AdminSectionHeader from "../components/admin/AdminSectionHeader";

function ClientesAdminPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await obtenerClientes(token);
    console.log(data);
    setClientes(data);
  };

  const formatearFecha = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
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
        <AdminSectionHeader eyebrow="Comunidad" title="Clientes" description="Buscá y consultá la información de los clientes registrados en la estética." icon={<Users size={17} />} />

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
