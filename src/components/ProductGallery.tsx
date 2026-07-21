"use client";

import { SafeImage } from "@/components/SafeImage";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [""];

  return (
    <div className="flex flex-col gap-3">
      <div className="product-frame relative aspect-square w-full overflow-hidden bg-panel">
        {gallery[active] ? (
          <SafeImage
            src={gallery[active]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Sin imagen
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`product-frame relative h-16 w-16 overflow-hidden ${
                active === i ? "" : "opacity-60"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <SafeImage src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
