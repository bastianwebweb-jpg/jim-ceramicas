"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function ProductCarousel({ products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-10">

      {/* BOTONES */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 px-3 py-2 rounded-full shadow"
      >
        ←
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 px-3 py-2 rounded-full shadow"
      >
        →
      </button>

      {/* CONTENIDO */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-10"
      >
        {products.map((p: any) => (
          <Link key={p.id} href={`/tienda/${p.id}`}>
            <div className="min-w-[220px] bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">

              <div className="relative h-40">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <p className="text-sm">{p.name}</p>
                <p className="font-semibold text-terracotta">
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