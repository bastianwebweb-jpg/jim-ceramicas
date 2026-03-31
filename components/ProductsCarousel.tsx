"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function ProductCarousel({ products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-6 md:mt-10">

      {/* BOTÓN IZQUIERDA */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 px-3 py-2 rounded-full shadow"
      >
        ←
      </button>

      {/* BOTÓN DERECHA */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 px-3 py-2 rounded-full shadow"
      >
        →
      </button>

      {/* CONTENIDO */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-10"
      >
        {products.map((p: any) => (
          <Link key={p.id} href={`/tienda/${p.id}`}>
            
            <div className="
              min-w-[160px] sm:min-w-[180px] md:min-w-[220px]
              bg-white rounded-xl overflow-hidden 
              shadow hover:shadow-xl transition
            ">

              {/* IMAGEN */}
              <div className="relative h-32 sm:h-36 md:h-40">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="p-3">
                <p className="text-xs sm:text-sm truncate">
                  {p.name}
                </p>

                <p className="font-semibold text-terracotta text-sm sm:text-base">
                  ${p.price}
                </p>
              </div>

            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}