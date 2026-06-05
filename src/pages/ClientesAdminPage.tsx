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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>

          <p className="text-sm text-gray-500">
            Clientes registrados en la estética
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Fecha nacimiento
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Teléfono
                </th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">{cliente.nombre_completo}</td>

                  <td className="px-6 py-4">{cliente.email}</td>

                  <td className="px-6 py-4">{cliente.fecha_nacimiento}</td>

                  <td className="px-6 py-4">{cliente.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ClientesAdminPage;
