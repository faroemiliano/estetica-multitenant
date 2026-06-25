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
  console.log("FOOTER RENDER");
  console.log("ESTETICA:", estetica);
  return (
    <footer className="flex flex-col items-center border-t border-red-500 bg-red-200 text-black">
      {" "}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold text-black">
            {" "}
            {estetica?.nombre || "Estética"}
          </h2>

          {horarios.length > 0 && (
            <div className="mt-2 text-sm font-medium text-pink-600">
              <p>Horarios de atención</p>

              {horarios.map((horario: any, index: number) => (
                <p key={index}>
                  {horario.inicio} a {horario.fin}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-800">
            Contacto
          </h3>

          <div className="flex flex-col gap-3 text-sm text-gray-500">
            <p>{estetica?.direccion || "Dirección no definida"}</p>

            {estetica?.whatsapp && <p>WhatsApp: {estetica.whatsapp}</p>}

            {estetica?.instagram_url && (
              <a
                href={estetica.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-pink-500"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {estetica?.nombre || "Estética"} · Todos
          los derechos reservados
        </div>
      </div>
    </footer>
  );
}

export default Footer;
