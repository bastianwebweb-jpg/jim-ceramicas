export default function ContactoPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      
      <h1 className="text-4xl font-bold mb-10 text-center">
        Contacto
      </h1>

      <div className="space-y-6 text-lg">

        {/* Dirección */}
        <div>
          <h2 className="font-semibold">📍 Dirección</h2>
          <p>Pichirropulli</p>
        </div>

        {/* Instagram */}
        <div>
          <h2 className="font-semibold">📸 Instagram</h2>
          <a
            href="https://instagram.com/"
            target="_blank"
            className="text-blue-600 underline"
          >
            Ver Instagram
          </a>
        </div>

        {/* WhatsApp */}
        <div>
          <h2 className="font-semibold">💬 WhatsApp</h2>
          <a
            href="https://wa.me/56912345678"
            target="_blank"
            className="text-green-600 underline"
          >
            +56 9 1234 5678
          </a>
        </div>

        {/* Email (opcional pero pro 😎) */}
        <div>
          <h2 className="font-semibold">📧 Email</h2>
          <p>contacto@jimceramicas.cl</p>
        </div>

      </div>
    </div>
  );
}