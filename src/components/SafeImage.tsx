"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function SafeImage({ alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-panel text-center text-xs text-muted">
        Imagen no disponible
      </div>
    );
  }

  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
