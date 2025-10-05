// hooks/useScrollRestoration.ts
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useScrollStore } from "@/stores/useScrollStore";

export function useScrollRestoration() {
  const pathname = usePathname();
  const { setScroll, getScroll } = useScrollStore();

  useEffect(() => {
    // Restore scroll position when mounting
    const savedPos = getScroll(pathname);
    window.scrollTo(0, savedPos);

    const handleScroll = () => {
      setScroll(pathname, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Save before leaving page
    return () => {
      setScroll(pathname, window.scrollY);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, setScroll, getScroll]);
}
