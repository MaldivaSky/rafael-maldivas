"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SITE_EVENTS, trackSiteEvent, type SiteEvent } from "../lib/analytics";

const allowed = new Set<string>(SITE_EVENTS);

export default function SiteAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = pathname || "/";
    if (lastPath.current === currentPath) return;
    lastPath.current = currentPath;
    trackSiteEvent("page_view", currentPath);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const value = target.closest<HTMLElement>("[data-analytics]")?.dataset.analytics;
      if (value && allowed.has(value)) trackSiteEvent(value as SiteEvent);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
