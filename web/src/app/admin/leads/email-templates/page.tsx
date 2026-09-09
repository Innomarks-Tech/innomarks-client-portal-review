import { randomUUID } from "node:crypto";
import { requireStaff } from "@/lib/server/staff-auth";
import { database } from "@/lib/server/database";
import { staffEmailConfigured } from "@/lib/server/staff-email";
import { StaffEmailComposer, ApproveEmailButton } from "@/components/staff-email-composer";

export default async function StaffEmailPage({ searchParams }: PageProps<"/admin/leads/email-templates">) {
  await requireStaff();
  const { inquiry } = await searchParams;
  const db = database();
  const [inquiries, messages] = await Promise.all([
    db.from("inquiries").select("id, public_reference, payload").order("created_at", { ascending: false }).limit(100),
    db.from("staff_email_outbox").select("id, recipient, subject, body, state, created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  const recipients = (inquiries.data ?? []).map(i => ({ id: i.id, reference: i.public_reference, name: String(i.payload.name || ""), company: String(i.payload.company || ""), email: String(i.payload.email || "") }));
  const enabled = staffEmailConfigured();
  const labels: Record<string, string> = { awaiting_approval: "Awaiting approval", queued: "Queued", sending: "Sending", accepted: "Accepted by Resend", failed: "Retry pending", needs_review: "Needs review" };
  return <div className="staff-workspace"><header className="staff-page-header"><span className="eyebrow purple">Client communication</span><h1>Email responses</h1><p>From info@innomarkstech.co.za · Follow-ups require staff approval.</p></header>
    {!enabled && <p className="email-preview-notice">Live email delivery is disabled. Configure Resend and verify the sender before sending.</p>}
    {inquiries.error || messages.error ? <div className="staff-state"><h2>Email workspace unavailable</h2><p>Check the database connection and apply the staff email migration.</p></div> : <div className="email-editor-grid">
      <StaffEmailComposer inquiries={recipients} initialInquiry={typeof inquiry === "string" ? inquiry : undefined} draftId={randomUUID()} />
      <section className="email-queue"><h2>Approval queue &amp; recent history</h2>{!messages.data?.length && <p>No messages yet.</p>}{messages.data?.map(message => <article className="email-card" key={message.id}><span className="status-badge">{labels[message.state]}</span><h3>{message.subject}</h3><p className="email-to">{message.recipient}</p><details><summary>Review message</summary><div className="email-body">{message.body}</div></details>{message.state === "awaiting_approval" && <ApproveEmailButton id={message.id} enabled={enabled} />}</article>)}</section>
    </div>}
  </div>;
}
