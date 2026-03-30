export default function NosotrosPage() {
  return (
    <div className="w-full bg-[#f5f0e8] text-[#2C2C2C]">

      {/* HERO */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl font-serif mb-6">Sobre el taller</h1>

        <div className="w-16 h-[2px] bg-terracotta mx-auto mb-6 opacity-60"></div>

        <p className="text-lg max-w-2xl mx-auto text-[#5A4A3F] leading-relaxed">
          Cerámica artesanal creada desde el sur de Chile, donde cada pieza
          nace del tiempo, el fuego y la intención.
        </p>
      </section>

      {/* HISTORIA */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* 📝 TEXTO */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif">El origen</h2>

          <p className="text-[#5A4A3F] leading-relaxed">
            Soy Juan Pablo, ceramista autodidacta desde el 2022, viviendo y trabajando en la XIV región de Chile. 
            Mi trabajo se desarrolla principalmente en torno alfarero, donde doy forma a piezas que combinan funcionalidad y expresión personal.
          </p>

          <p className="text-[#5A4A3F] leading-relaxed">
            Me inspira profundamente la biodiversidad del país, sus colores, texturas y formas, 
            que ofrecen una fuente inagotable de ideas. Esta influencia se refleja en cada pieza, 
            buscando transmitir algo orgánico y auténtico.
          </p>
        </div>

        {/* 🖼 IMAGEN */}
        <div className="h-80 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Foto del taller / proceso</span>
        </div>

      </section>

      {/* PROCESO */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* 🖼 IMAGEN */}
        <div className="h-80 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Torno / piezas en proceso</span>
        </div>

        {/* 📝 TEXTO */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif">El proceso</h2>

          <p className="text-[#5A4A3F] leading-relaxed">
            Confecciono una amplia variedad de piezas y formas, desde tazas, cuencos y platos, 
            hasta lámparas, floreros y piezas más experimentales. Cada una es única y pintada a mano, 
            lo que le da un carácter irrepetible.
          </p>

          <p className="text-[#5A4A3F] leading-relaxed">
            Trabajo principalmente con gres (arcilla de alta temperatura), valorando las técnicas 
            y procesos detrás de la cerámica. Cada etapa requiere paciencia, tiempo y dedicación.
          </p>
        </div>

      </section>

      {/* VALORES / FILOSOFÍA */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-serif text-center mb-12">
          Filosofía del taller
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-[#f5f0e8] rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Hecho a mano</h3>
            <p className="text-[#5A4A3F]">
              Cada pieza es trabajada manualmente, respetando el ritmo del material y el proceso.
            </p>
          </div>

          <div className="p-6 bg-[#f5f0e8] rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Imperfección</h3>
            <p className="text-[#5A4A3F]">
              Las variaciones y detalles hacen única cada pieza, reflejando su origen artesanal.
            </p>
          </div>

          <div className="p-6 bg-[#f5f0e8] rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Tiempo</h3>
            <p className="text-[#5A4A3F]">
              El proceso no se apura. Cada etapa —modelado, secado, cocción— tiene su propio ritmo.
            </p>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#3B2F2F] text-white py-24 px-6 text-center">
        <h2 className="text-3xl font-serif mb-4">
          Descubre las piezas
        </h2>

        <p className="mb-6 text-[#F5EFE6]">
          Cada objeto cuenta una historia. Encuentra el tuyo.
        </p>

        <a
          href="/tienda"
          className="bg-terracotta px-8 py-3 rounded-md font-medium hover:opacity-90 transition"
        >
          Ver tienda
        </a>
      </section>

    </div>
  );
}