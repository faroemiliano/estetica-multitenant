import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { obtenerClientes } from "../services/clientes";

function ClientesAdminPage() {
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await obtenerClientes(token);
    setClientes(data);
  };

  return (
    <AdminLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Clientes
          </h1>

          <p className="text-sm text-gray-500">
            Clientes registrados en la estética
          </p>
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
              {clientes.map((cliente) => (
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
                      ? new Date(cliente.fecha_nacimiento).toLocaleDateString(
                          "es-AR",
                        )
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
            {clientes.map((cliente) => (
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
                      ? new Date(cliente.fecha_nacimiento).toLocaleDateString(
                          "es-AR",
                        )
                      : "-"}
                  </div>

                  <div>📞 {cliente.telefono || "Sin teléfono"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ClientesAdminPage;
