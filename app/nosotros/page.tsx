export default function NosotrosPage() {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="bg-stone-100 py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Sobre Nosotros</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Aquí puedes agregar una breve introducción de tu marca, lo que haces
          y lo que te hace especial.
        </p>
      </section>

      {/* HISTORIA */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* TEXTO */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">Nuestra Historia</h2>
          <p className="text-stone-600 leading-relaxed">
            Aquí puedes agregar un poco de tu historia, cómo comenzaste,
            tu proceso creativo, inspiración, etc.
          </p>
        </div>

        {/* IMAGEN */}
        <div className="h-80 bg-gray-200 rounded-3xl flex items-center justify-center">
          <span className="text-gray-500">Imagen aquí</span>
        </div>

      </section>

      {/* VALORES */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Nuestros Valores
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-stone-50 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Calidad</h3>
            <p className="text-stone-600">
              Puedes describir la calidad de tus productos.
            </p>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Artesanía</h3>
            <p className="text-stone-600">
              Explica el proceso artesanal o único.
            </p>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl shadow">
            <h3 className="font-semibold text-xl mb-2">Pasión</h3>
            <p className="text-stone-600">
              Cuenta lo que te motiva a crear.
            </p>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-orange-500 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Descubre nuestras piezas
        </h2>
        <p className="mb-6">
          Explora nuestra tienda y encuentra algo único.
        </p>

        <a
          href="/tienda"
          className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Ir a la tienda
        </a>
      </section>

    </div>
  );
}