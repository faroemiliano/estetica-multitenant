import { useEstetica } from "../context/EsteticaContext";

function Hero() {
  const { estetica } = useEstetica();

  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[#f7f4f2] px-4 py-20">
      {/* FONDO */}
      <div className="absolute inset-0">
        <img
          src={
            estetica?.hero_image ||
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Estética"
          className="h-full w-full object-cover"
        />

        <div />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center text-white">
        <span className="mt-150 mb-4 rounded-full border border-white/40 bg-[rgba(250,247,243,0.75)] px-8 py-3 text-sm font-medium uppercase tracking-[0.35em] text-[#7A6661] backdrop-blur-2xl shadow-[0_12px_40px_rgba(120,90,80,0.18)] transition-all duration-500 hover:bg-[rgba(250,247,243,0.9)]">
          ✦ Bienestar • Belleza • Cuidado Personal ✦
        </span>

        {/* <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
          Realzá tu belleza natural
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
          Tratamientos estéticos diseñados para ayudarte a sentirte bien, verte
          increíble y disfrutar un momento para vos.
        </p> */}
      </div>
    </section>
  );
}

export default Hero;
