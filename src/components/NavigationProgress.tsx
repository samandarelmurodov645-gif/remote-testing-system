"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 100, minimum: 0.3 });

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Intercept all internal anchor clicks to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Only internal same-origin navigations
      if (href.startsWith("/") || href.startsWith(window.location.origin)) {
        NProgress.start();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Complete the bar whenever the route resolves
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
