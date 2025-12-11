import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1000) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const listener = () => setIsMobile(media.matches);

    listener(); // initial check
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);

  return isMobile;
}
