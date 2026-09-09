import { FlaskConical } from "lucide-react";

export function PreviewBanner() {
  return <div className="preview-banner" role="status"><FlaskConical size={17} aria-hidden="true" /><div><strong>Development preview</strong><span>Fictional data only. Changes reset when you refresh.</span></div></div>;
}
