import DOMPurify from "dompurify";

interface HtmlViewerProps {
  className?: string | null;
  value?: string | null;
}

export default function HtmlViewer({ className, value }: HtmlViewerProps) {
  const clean = DOMPurify.sanitize(value || "");

  return <div className={className || ""} dangerouslySetInnerHTML={{ __html: clean }} />;
}
