"use client";

import { useEffect, useState } from "react";

export function useExitIntent(delayMs = 2000, triggerOnce = true) {
  const [isTriggered, setIsTriggered] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Se já foi disparado e deve disparar só uma vez, aborta
    if (triggerOnce && hasTriggered) return;

    let timeout: NodeJS.Timeout;
    
    // Dispara após ficar X tempo na página (fallback)
    const timeTrigger = setTimeout(() => {
      if (!isTriggered && (!triggerOnce || !hasTriggered)) {
        setIsTriggered(true);
        setHasTriggered(true);
      }
    }, delayMs * 60); // Ex: 2000ms * 60 = 2 minutos (ou o que for passado)

    const handleMouseLeave = (e: MouseEvent) => {
      // Se o mouse sair por cima (direção da barra de endereço/fechar aba)
      if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        if (!isTriggered && (!triggerOnce || !hasTriggered)) {
          setIsTriggered(true);
          setHasTriggered(true);
          clearTimeout(timeTrigger);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeTrigger);
    };
  }, [isTriggered, hasTriggered, triggerOnce, delayMs]);

  const dismiss = () => setIsTriggered(false);

  return { isTriggered, dismiss };
}
