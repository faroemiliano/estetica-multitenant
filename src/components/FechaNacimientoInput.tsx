import { useId, useRef, useState } from "react";

type FechaNacimientoInputProps = {
  onChange: (value: string) => void;
  initialValue?: string;
  required?: boolean;
  variant?: "rose" | "gray";
};

const soloNumeros = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

const esFechaValida = (dia: string, mes: string, anio: string) => {
  if (dia.length < 1 || mes.length < 1 || anio.length !== 4) return false;

  const day = Number(dia);
  const month = Number(mes);
  const year = Number(anio);
  const fecha = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    fecha <= new Date() &&
    fecha.getFullYear() === year &&
    fecha.getMonth() === month - 1 &&
    fecha.getDate() === day
  );
};

function FechaNacimientoInput({
  onChange,
  initialValue = "",
  required = false,
  variant = "gray",
}: FechaNacimientoInputProps) {
  const id = useId();
  const anioRef = useRef<HTMLInputElement>(null);
  const [anioInicial = "", mesInicial = "", diaInicial = ""] =
    initialValue.split("-");
  const [dia, setDia] = useState(diaInicial);
  const [mes, setMes] = useState(mesInicial);
  const [anio, setAnio] = useState(anioInicial);

  const actualizarFecha = (
    nuevoDia: string,
    nuevoMes: string,
    nuevoAnio: string,
  ) => {
    const hayAlgunDato = Boolean(nuevoDia || nuevoMes || nuevoAnio);
    const completa = Boolean(nuevoDia && nuevoMes && nuevoAnio.length === 4);
    const valida = completa && esFechaValida(nuevoDia, nuevoMes, nuevoAnio);

    let mensaje = "";
    if ((required || hayAlgunDato) && !completa) {
      mensaje = "Completá el día, mes y año.";
    } else if (completa && !valida) {
      mensaje = "Ingresá una fecha de nacimiento válida.";
    }
    anioRef.current?.setCustomValidity(mensaje);

    onChange(
      valida
        ? `${nuevoAnio}-${nuevoMes.padStart(2, "0")}-${nuevoDia.padStart(2, "0")}`
        : "",
    );
  };

  const estilos =
    variant === "rose"
      ? "border-rose-200 bg-rose-50/40 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
      : "border-gray-200 bg-gray-50 focus:border-pink-400 focus:bg-white";

  const campoBase = `w-full rounded-xl border px-3 py-3 text-center font-normal text-gray-700 outline-none transition ${estilos}`;

  return (
    <div>
      <div className="grid grid-cols-[0.8fr_0.8fr_1.25fr] gap-2">
        <label htmlFor={`${id}-dia`} className="sr-only">Día</label>
        <input
          id={`${id}-dia`}
          type="text"
          inputMode="numeric"
          autoComplete="bday-day"
          placeholder="Día"
          value={dia}
          className={campoBase}
          onChange={(event) => {
            const nuevoDia = soloNumeros(event.target.value, 2);
            setDia(nuevoDia);
            actualizarFecha(nuevoDia, mes, anio);
          }}
        />
        <label htmlFor={`${id}-mes`} className="sr-only">Mes</label>
        <input
          id={`${id}-mes`}
          type="text"
          inputMode="numeric"
          autoComplete="bday-month"
          placeholder="Mes"
          value={mes}
          className={campoBase}
          onChange={(event) => {
            const nuevoMes = soloNumeros(event.target.value, 2);
            setMes(nuevoMes);
            actualizarFecha(dia, nuevoMes, anio);
          }}
        />
        <label htmlFor={`${id}-anio`} className="sr-only">Año</label>
        <input
          ref={anioRef}
          id={`${id}-anio`}
          type="text"
          inputMode="numeric"
          autoComplete="bday-year"
          placeholder="Año (1989)"
          value={anio}
          className={campoBase}
          onChange={(event) => {
            const nuevoAnio = soloNumeros(event.target.value, 4);
            setAnio(nuevoAnio);
            actualizarFecha(dia, mes, nuevoAnio);
          }}
        />
      </div>
      <p className="mt-1.5 text-xs font-normal text-gray-400">Ejemplo: 25 / 08 / 1989</p>
    </div>
  );
}

export default FechaNacimientoInput;
