import { useEstetica } from "../context/EsteticaContext";

function Footer() {
  const { estetica } = useEstetica();

  let horarios = [];

  try {
    horarios = Array.isArray(estetica?.horarios)
      ? estetica.horarios
      : estetica?.horarios
        ? JSON.parse(estetica.horarios)
        : [];
  } catch {
    horarios = [];
  }

  return (
    <footer className="border-t border-pink-100 bg-gradient-to-b from-white to-pink-50 text-gray-700">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 md:flex-row md:items-start md:justify-between">
        {/* BRAND + HORARIOS */}
        <div className="max-w-sm">
          {horarios.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white/70 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-500">
                Horarios de atención
              </p>

              <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600">
                {horarios.map(
                  (horario: { inicio: string; fin: string }, index: number) => (
                    <p key={index}>
                      {horario.inicio} a {horario.fin}
                    </p>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* LOGO CENTRAL */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-38 w-38 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-pink-100">
            <img
              src={estetica?.logo_url ?? ""}
              alt="Logo"
              className="h-100 w-80 object-contain"
            />
          </div>

          <p className="mt-4 text-xs font-semibold tracking-[0.3em] text-pink-500">
            ESTÉTICA · BELLEZA · BIENESTAR
          </p>
        </div>

        {/* CONTACTO */}
        <div className="md:text-right">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Contacto
          </h3>

          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <p>{estetica?.direccion || "Dirección no definida"}</p>

            {estetica?.whatsapp && (
              <p className="font-medium text-gray-700">
                WhatsApp: {estetica.whatsapp}
              </p>
            )}

            {estetica?.instagram_url && (
              <a
                href={estetica.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-pink-500 transition hover:text-pink-600"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-pink-100 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {estetica?.nombre || "Estética"} · Todos
          los derechos reservados por www.farixio.com
        </div>
      </div>
    </footer>
  );
}

export default Footer;
