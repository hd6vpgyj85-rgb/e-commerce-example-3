"use client";

import { SafeImage } from "@/components/SafeImage";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "@/components/icons";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const gallery = images.length > 0 ? images : [""];

  useEffect(() => {
    if (!previewOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewOpen(false);
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % gallery.length);
      }
      if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + gallery.length) % gallery.length);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewOpen, gallery.length]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => gallery[active] && setPreviewOpen(true)}
        aria-label="Ver imagen en grande"
        className="product-frame relative aspect-square w-full overflow-hidden bg-panel"
      >
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
      </button>

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

      {previewOpen && gallery[active] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            aria-label="Cerrar vista previa"
            className="absolute right-4 top-4 text-off-white transition-colors hover:text-neon"
          >
            <X size={28} />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i - 1 + gallery.length) % gallery.length);
                }}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-off-white transition-colors hover:text-neon"
              >
                <ArrowLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i + 1) % gallery.length);
                }}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-off-white transition-colors hover:text-neon"
              >
                <ArrowRight size={28} />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={gallery[active]}
              alt={name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
