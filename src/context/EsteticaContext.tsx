import { createContext, useContext, useEffect, useState } from "react";
import { obtenerEstetica } from "../services/esteticas";
import { useParams } from "react-router-dom";

type Estetica = {
  id: number;

  nombre: string;

  slug: string;

  logo_url?: string | null;

  color_primario?: string | null;

  hero_image?: string | null;

  instagram_url?: string | null;

  whatsapp?: string | null;

  horarios?: string | null;

  hora_cierre?: string | null;

  duracion_turnos?: number | null;

  direccion?: string | null;

  created_at?: string;
};

type ContextType = {
  estetica: Estetica | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const EsteticaContext = createContext<ContextType>({
  estetica: null,
  loading: true,
  refresh: () => Promise.resolve(),
});

export function EsteticaProvider({ children }: any) {
  const [estetica, setEstetica] = useState<Estetica | null>(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  console.log("ESTETICA CONTEXT SLUG:", slug);
  const load = async () => {
    if (!slug) return;

    setLoading(true);

    try {
      const data = await obtenerEstetica(slug);
      setEstetica(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [slug]);

  return (
    <EsteticaContext.Provider
      value={{
        estetica,
        loading,
        refresh: load, // 🔥 esto es lo nuevo
      }}
    >
      {children}
    </EsteticaContext.Provider>
  );
}

export const useEstetica = () => useContext(EsteticaContext);
