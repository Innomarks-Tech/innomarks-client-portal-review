import { requireStaff } from "@/lib/server/staff-auth";
import { staffEmailConfigured } from "@/lib/server/staff-email";
import Link from "next/link";
export default async function AutomationPage() {
  await requireStaff();
  return <div className="staff-workspace"><header className="staff-page-header"><span className="eyebrow purple">Client communication</span><h1>Email automation</h1><p>Your agreed response workflow.</p></header><div className="automation-rules">
    <section className="email-card"><h2>Enquiry acknowledgement</h2><span className="status-badge">{staffEmailConfigured() ? "Delivery enabled" : "Delivery disabled"}</span><p>A new enquiry queues an acknowledgement in the same database transaction. Resend sends it from info@innomarkstech.co.za.</p><div className="rule-flow"><span>Enquiry received</span><span>→</span><span>Acknowledgement queued</span><span>→</span><span>Resend</span></div></section>
    <section className="email-card"><h2>Follow-up responses</h2><span className="status-badge">Approval required</span><p>Choose a template, personalise the response and save a draft. An active staff member must review and approve each email.</p><Link href="/admin/leads/email-templates" className="text-link">Open response queue →</Link></section>
    </div><p className="form-note">Failed sends remain recorded for retry. Messages beyond the retry window require review. Provider acceptance does not confirm inbox delivery.</p></div>;
}
