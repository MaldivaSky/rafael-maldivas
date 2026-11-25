"use client";

import dynamic from "next/dynamic";
import type { EcoNode } from "./MetaTariffScene";

const Scene = dynamic(() => import("./MetaTariffScene"), {
  ssr: false,
  loading: () => <div className="eco eco-loading" aria-hidden="true" />,
});

/** Modelo 3D da tarifa Meta (out/2026) no hub do Atol Connect. */
export default function MetaTariffSceneLazy({ lang }: { lang: "pt" | "en" }) {
  const pt = lang === "pt";
  const nodes: EcoNode[] = [
    { id: "erp", label: "ERP / PDV", sub: pt ? "seu sistema" : "your system", color: "#cbd5e1", href: `/${lang}/desenvolvedores` },
    { id: "loja", label: pt ? "Loja virtual" : "Online store", sub: "e-commerce", color: "#cbd5e1", href: `/${lang}/whatsapp-api/nichos/ecommerce` },
    { id: "agenda", label: pt ? "Agenda" : "Scheduling", sub: pt ? "clínicas" : "clinics", color: "#cbd5e1", href: `/${lang}/whatsapp-api/nichos/clinicas-saude` },
    { id: "inbox", label: "Inbox", sub: pt ? "equipe" : "team", color: "#cbd5e1", href: "https://connect.maldivastech.dev" },
  ];
  return (
    <Scene
      lang={lang}
      nodes={nodes}
      coreLabel={{ title: "Atol Connect", sub: pt ? "Cloud API oficial" : "Official Cloud API", href: "https://connect.maldivastech.dev/?utm_source=maldivastech&utm_medium=portal&utm_campaign=hub-3d" }}
    />
  );
}
