import { useEstetica } from "../context/EsteticaContext";

function Footer() {
  const { estetica } = useEstetica();
  console.log("ESTETICA EN FOOTER:", estetica);
  return (
    <footer className="flex flex-col items-center border-t border-gray-200 bg-[#faf7f5]">
      {/* TOP */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-start md:justify-between">
        {/* BRAND */}
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            {estetica?.nombre || "Estética"}
          </h2>

          {estetica?.horarios && (
            <div className="mt-2 whitespace-pre-line text-sm font-medium text-pink-600">
              {estetica.horarios}
            </div>
          )}
        </div>

        {/* CONTACTO */}
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
                className="hover:text-pink-500 transition"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
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
