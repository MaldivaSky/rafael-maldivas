"use client";

import dynamic from "next/dynamic";

/**
 * O fundo 3D (three + R3F) só existe no navegador. Desde o Next 15,
 * `ssr: false` precisa viver num Client Component — este wrapper existe só
 * para isso; o layout raiz (Server Component) importa este arquivo.
 */
const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });

export default function ThreeBackgroundLazy() {
  return <ThreeBackground />;
}
