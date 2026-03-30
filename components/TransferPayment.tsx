"use client";

export default function TransferPayment({ total }: { total: number }) {
  const mensaje = encodeURIComponent(
    `Hola! Acabo de hacer un pedido en la web por $${total}. Adjunto comprobante de transferencia.`
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">

      {/* 🧾 TÍTULO */}
      <h2 className="text-xl font-semibold mb-4 text-[#2C2C2C]">
        Pago por transferencia
      </h2>

      {/* ℹ️ INFO */}
      <p className="text-sm text-gray-600 mb-6">
        Realiza la transferencia a los siguientes datos y envía tu comprobante para confirmar el pedido.
      </p>

      {/* 💳 DATOS BANCARIOS */}
      <div className="bg-[#f5f0e8] rounded-xl p-4 text-sm space-y-2 mb-6">
        <p><strong>Banco:</strong> BancoEstado</p>
        <p><strong>Nombre:</strong> Juan Pablo XXXX</p>
        <p><strong>Cuenta:</strong> 12345678</p>
        <p><strong>Tipo:</strong> Cuenta RUT</p>
        <p><strong>Email:</strong> correo@email.com</p>
      </div>

      {/* 💰 TOTAL */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600">Total a pagar:</span>
        <span className="text-xl font-bold text-terracotta">
          ${total}
        </span>
      </div>

      {/* 📲 BOTÓN WHATSAPP */}
      <a
        href={`https://wa.me/56995786212?text=${mensaje}`}
        target="_blank"
        className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
      >
        Enviar comprobante por WhatsApp
      </a>

      {/* 🔒 SEGURIDAD */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        🔒 Tu pedido será confirmado una vez recibido el comprobante.
      </p>
    </div>
  );
}