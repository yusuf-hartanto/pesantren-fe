"use client";

import { useEffect, useState } from "react";

type HtmlViewerProps = {
  value?: string;
  className?: string;
};

export default function HtmlViewer({ value = "", className }: HtmlViewerProps) {
  const [clean, setClean] = useState("");

  useEffect(() => {
    let mounted = true;

    import("dompurify").then((mod) => {
      if (!mounted) return;
      const DOMPurify = mod.default;

      setClean(DOMPurify.sanitize(value));
    });

    return () => {
      mounted = false;
    };
  }, [value]);

  if (!clean) return null;

  return (
    <div
      className={className ?? ""}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
