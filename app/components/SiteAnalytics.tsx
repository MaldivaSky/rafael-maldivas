"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SITE_EVENTS, trackSiteEvent, type SiteEvent } from "../lib/analytics";
import { capturarOrigem } from "../lib/origem-client";

const allowed = new Set<string>(SITE_EVENTS);

/** teto por saída: aba esquecida aberta não vira "3 horas de leitura" */
const MAX_SEGUNDOS = 1800;

export default function SiteAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // tempo em que a página esteve VISÍVEL (aba em segundo plano não conta)
  const visivelDesde = useRef<number | null>(null);
  const acumuladoMs = useRef(0);

  const pararRelogio = () => {
    if (visivelDesde.current !== null) {
      acumuladoMs.current += Date.now() - visivelDesde.current;
      visivelDesde.current = null;
    }
  };

  /** manda os segundos desta página e zera; sem tempo útil, não manda nada */
  const enviarSaida = (path: string | null) => {
    pararRelogio();
    const segundos = Math.min(Math.round(acumuladoMs.current / 1000), MAX_SEGUNDOS);
    acumuladoMs.current = 0;
    if (path && segundos >= 1) trackSiteEvent("page_exit", path, segundos);
  };

  // de onde a pessoa veio: lido uma vez por carga (não a cada troca de rota)
  useEffect(() => {
    capturarOrigem();
  }, []);

  useEffect(() => {
    const currentPath = pathname || "/";
    if (lastPath.current === currentPath) return;
    // saiu da página anterior (navegação interna): fecha o tempo dela
    enviarSaida(lastPath.current);
    lastPath.current = currentPath;
    if (document.visibilityState === "visible") visivelDesde.current = Date.now();
    trackSiteEvent("page_view", currentPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "hidden") {
        // também cobre fechar a aba e trocar de app no celular
        enviarSaida(lastPath.current);
      } else {
        visivelDesde.current = Date.now();
      }
    };
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const value = target.closest<HTMLElement>("[data-analytics]")?.dataset.analytics;
      // page_view/page_exit são do relógio acima, nunca de um clique
      if (value && allowed.has(value) && value !== "page_view" && value !== "page_exit") {
        trackSiteEvent(value as SiteEvent);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
