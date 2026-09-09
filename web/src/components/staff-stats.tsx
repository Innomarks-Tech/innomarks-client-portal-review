import Link from "next/link";
import { Inbox, MessageCircle, Send, Sparkles } from "lucide-react";

export function StaffStats({ counts, basePath }: { counts: { total: number | null; new: number | null; contacted: number | null; proposals: number | null }; basePath: string }) {
  const stats = [
    { label: "Total inquiries", value: counts.total, icon: Inbox, href: basePath, detail: "All project briefs" },
    { label: "New inquiries", value: counts.new, icon: Sparkles, href: basePath + "?status=New", detail: "Awaiting first contact" },
    { label: "Contacted", value: counts.contacted, icon: MessageCircle, href: basePath + "?status=Contacted", detail: "Conversations in progress" },
    { label: "Proposals sent", value: counts.proposals, icon: Send, href: basePath + "?status=Proposal+Sent", detail: "Ready for the next step" },
  ];
  return <nav className="staff-stats" aria-label="Inquiry overview">{stats.map(({ label, value, icon: Icon, href, detail }) =>
    <Link key={label} href={href}><span><Icon size={18} aria-hidden="true" />{label}</span><strong>{value ?? "—"}</strong><small>{value === null ? "Count unavailable" : detail}</small></Link>,
  )}</nav>;
}
