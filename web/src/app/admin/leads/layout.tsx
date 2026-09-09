import { LogOut } from "lucide-react";
import { PreviewNavigation } from "@/components/preview-navigation";
import { Brand } from "@/components/brand";
import { requireStaff } from "@/lib/server/staff-auth";
import { signOut } from "@/app/admin/login/actions";
export const dynamic = "force-dynamic";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return <div className="staff-shell"><aside className="staff-sidebar"><div><Brand /><span className="staff-portal-label">Staff Portal</span></div><PreviewNavigation live /><div className="staff-account"><span>{staff.displayName}</span>{staff.email && <small>{staff.email}</small>}<form action={signOut}><button type="submit"><LogOut size={15} aria-hidden="true" />Sign out</button></form></div></aside><main id="main-content" className="staff-main">{children}</main></div>;
}
