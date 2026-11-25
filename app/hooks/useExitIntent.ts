"use client";

import { useEffect, useState } from "react";

/**
 * Exit-intent honesto:
 *  - só arma depois de `armAfterMs` na página (padrão 45s);
 *  - só em desktop com mouse (pointer: fine) — no celular não existe "saída pelo topo";
 *  - só quando o cursor sai pela borda SUPERIOR (rumo à aba/barra de endereço);
 *  - no máximo uma vez por sessão do navegador.
 * Nunca dispara por tempo sozinho.
 */
export function useExitIntent(armAfterMs = 45_000, storageKey = "mt_exit_shown") {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem(storageKey)) return;
    } catch {
      /* storage bloqueado: segue sem persistência */
    }

    let armed = false;
    const armTimer = setTimeout(() => {
      armed = true;
    }, armAfterMs);

    const onLeave = (e: MouseEvent) => {
      if (!armed || e.relatedTarget !== null || e.clientY > 0) return;
      setIsTriggered(true);
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
      document.removeEventListener("mouseout", onLeave);
    };

    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [armAfterMs, storageKey]);

  return { isTriggered, dismiss: () => setIsTriggered(false) };
}
