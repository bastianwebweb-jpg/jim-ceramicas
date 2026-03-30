import Image from "next/image";
import { getSupabase } from "../../../lib/supabaseserver";
import AddToCartButton from "../../../components/AddToCartButton";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
};

async function getRelatedProducts(id: string) {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .neq("id", id)
    .limit(3);

  return data as Product[];
}

async function getProduct(id: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error REAL:", error.message);
    return null;
  }

  return data as Product;
}

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const product = await getProduct(params.id);
  const relatedProducts = await getRelatedProducts(params.id);

  if (!product) {
    return <div className="p-10">Producto no encontrado</div>;
  }

  return (
  <div className="bg-[#f5f0e8] min-h-screen">
      {/* 🧱 PRODUCTO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        {/* IMAGEN */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="w-12 h-[2px] bg-terracotta mb-6 opacity-60"></div>

          <p className="text-3xl text-terracotta font-bold mb-2">
            ${product.price}
          </p>

          {/* 🔥 STOCK MEJORADO */}
          <div className="mb-6 space-y-1">
            {product.stock === 0 && (
              <p className="text-red-500 font-medium">
                Producto agotado
              </p>
            )}

            {product.stock > 0 && product.stock <= 3 && (
              <>
                <p className="text-orange-500 font-semibold animate-pulse">
                  🔥 Últimas {product.stock} unidades
                </p>
                <p className="text-xs text-[#5A4A3F]">
                  Alta demanda por esta pieza
                </p>
              </>
            )}

            {product.stock > 3 && (
              <p className="text-green-600 font-medium">
                Disponible ({product.stock})
              </p>
            )}
          </div>

          <p className="text-[#5A4A3F] leading-relaxed mb-8 text-lg">
            {product.description || 
              "Pieza única hecha a mano. Cada detalle refleja el proceso artesanal y la dedicación puesta en su creación."}
          </p>

          {/* 🛒 BOTÓN MEJORADO */}
          {product.stock > 0 ? (
            <div className="space-y-2">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url,
                }}
              />
              <p className="text-xs text-[#5A4A3F]">
                Envíos a todo Chile 🇨🇱
              </p>
            </div>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-6 py-3 rounded-md w-full"
            >
              Agotado
            </button>
          )}
        </div>

      </div>

      {/* 🏺 HISTORIA */}
      <section className="bg-[#ede6dc] py-24 px-6 text-center">
        <h2 className="text-3xl font-serif mb-6">
          Sobre esta pieza
        </h2>

        <p className="max-w-2xl mx-auto text-[#5A4A3F] leading-relaxed">
          Cada pieza es moldeada a mano y pasa por un proceso de cocción que define su carácter único. 
          Las variaciones en textura y color son parte de su esencia artesanal.
        </p>
      </section>

      {/* 🔥 RELACIONADOS MEJORADOS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-serif mb-10 text-center">
          Otras piezas que podrían interesarte
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {relatedProducts?.map((p) => (
            <Link key={p.id} href={`/tienda/${p.id}`}>
              <div className="group bg-white border border-[#e5ded3] rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer">
                
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />

                  <span className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Hecho a mano
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-terracotta font-semibold">
                    ${p.price}
                  </p>
                  <p className="text-xs text-[#5A4A3F]">
                    Ver producto →
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}