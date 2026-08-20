import axios from "axios";
import { useEffect, useState } from "react";
import { obtenerClientes } from "../../services/clientes";
import { obtenerServicios } from "../../services/servicios";
import {
  crearTurnoAdmin,
  obtenerHorariosDisponibles,
} from "../../services/turnos";

type Props = {
  onCreado: () => void | Promise<void>;
};

type Cliente = {
  id: number;
  nombre_completo?: string;
  email: string;
};

type Servicio = {
  id: number;
  nombre: string;
  profesional_id?: number;
  profesional?: { id: number };
};

const fechaLocal = (fecha: Date) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

const mensajeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }
  return "No se pudo crear el turno. Revisá los datos e intentá nuevamente.";
};

function CrearTurnoAdmin({ onCreado }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    Promise.all([obtenerClientes(token), obtenerServicios(token)])
      .then(([listaClientes, listaServicios]) => {
        setClientes(listaClientes);
        setServicios(listaServicios);
      })
      .catch((err) => setError(mensajeError(err)));
  }, []);

  const buscarHorarios = async (
    nuevaFecha: string,
    nuevoServicioId: string,
  ) => {
    const servicio = servicios.find(
      (item) => String(item.id) === nuevoServicioId,
    );
    const profesionalId = servicio?.profesional?.id ?? servicio?.profesional_id;
    const token = localStorage.getItem("token");
    if (!token || !nuevaFecha || !nuevoServicioId || !profesionalId) return;

    setCargando(true);
    try {
      const disponibles = await obtenerHorariosDisponibles(
        token,
        nuevaFecha,
        Number(profesionalId),
        Number(nuevoServicioId),
      );
      setHorarios(disponibles);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !clienteId || !servicioId || !fecha || !hora) return;

    setGuardando(true);
    setError("");
    setExito("");
    try {
      await crearTurnoAdmin(token, {
        cliente_id: Number(clienteId),
        servicio_id: Number(servicioId),
        fecha,
        hora,
      });
      setFecha("");
      setHora("");
      setHorarios([]);
      setExito("Turno anotado correctamente.");
      await onCreado();
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const puedeGuardar = clienteId && servicioId && fecha && hora && !guardando;

  return (
    <form
      onSubmit={guardar}
      className="rounded-3xl border border-pink-100 bg-pink-50/50 p-5"
    >
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900">Anotar un turno</h3>
        <p className="mt-1 text-sm text-gray-500">
          Elegí un cliente registrado y uno de los horarios disponibles.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-gray-700">
          Cliente
          <select
            required
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 font-normal"
          >
            <option value="">Seleccionar</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre_completo || cliente.email}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-gray-700">
          Servicio
          <select
            required
            value={servicioId}
            onChange={(e) => {
              const nuevoServicioId = e.target.value;
              setServicioId(nuevoServicioId);
              setHora("");
              setHorarios([]);
              setError("");
              void buscarHorarios(fecha, nuevoServicioId);
            }}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 font-normal"
          >
            <option value="">Seleccionar</option>
            {servicios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-gray-700">
          Fecha
          <input
            required
            type="date"
            min={fechaLocal(new Date())}
            value={fecha}
            onChange={(e) => {
              const nuevaFecha = e.target.value;
              setFecha(nuevaFecha);
              setHora("");
              setHorarios([]);
              setError("");
              void buscarHorarios(nuevaFecha, servicioId);
            }}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 font-normal"
          />
        </label>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-gray-700">Horario</p>
        {cargando ? (
          <p className="text-sm text-gray-500">Buscando horarios...</p>
        ) : horarios.length ? (
          <div className="flex flex-wrap gap-2">
            {horarios.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setHora(item)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  hora === item
                    ? "bg-pink-600 text-white"
                    : "border border-pink-200 bg-white text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {fecha && servicioId
              ? "No hay horarios disponibles para esa fecha."
              : "Seleccioná servicio y fecha para ver los horarios."}
          </p>
        )}
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      {exito && (
        <p className="mt-4 text-sm font-semibold text-emerald-700">{exito}</p>
      )}

      <button
        type="submit"
        disabled={!puedeGuardar}
        className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {guardando ? "Guardando..." : "Anotar turno"}
      </button>
    </form>
  );
}

export default CrearTurnoAdmin;
