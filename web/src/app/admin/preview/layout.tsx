import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Brand } from "@/components/brand";
import { PreviewNavigation } from "@/components/preview-navigation";
import { PreviewEmailProvider } from "@/components/preview-email-provider";
import { PreviewBanner } from "@/components/preview-banner";
import { staffPreviewEnabled } from "@/lib/staff-preview";

export default function StaffPreviewLayout({ children }: { children: React.ReactNode }) {
  if (!staffPreviewEnabled()) notFound();
  return <PreviewEmailProvider><div className="staff-shell preview-shell"><aside className="staff-sidebar"><div><Brand /><span className="staff-portal-label">Staff Portal · Preview</span></div><PreviewNavigation /><div className="staff-account"><span>Preview Staff</span><small>Development session</small><Link className="preview-exit" href="/admin/login"><ArrowLeft size={15} aria-hidden="true" />Exit preview</Link></div></aside><main id="main-content" className="staff-main"><PreviewBanner />{children}</main></div></PreviewEmailProvider>;
}
