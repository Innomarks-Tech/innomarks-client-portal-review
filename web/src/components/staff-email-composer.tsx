"use client";
import { useActionState, useState } from "react";
import { emailTemplates, personaliseEmail } from "@/lib/email-templates";
import { createEmailDraft, approveEmail, type EmailActionState } from "@/app/admin/leads/email-templates/actions";
type Recipient = { id: string; name: string; company?: string; email: string; reference: string };
const initial: EmailActionState = { error: "", success: "" };
export function StaffEmailComposer({ inquiries, initialInquiry, draftId }: { inquiries: Recipient[]; initialInquiry?: string; draftId: string }) {
  const [state, action, pending] = useActionState(createEmailDraft, initial);
  const [inquiryId, setInquiryId] = useState(inquiries.find(i => i.id === initialInquiry)?.id ?? inquiries[0]?.id ?? "");
  const [templateId, setTemplateId] = useState(emailTemplates[1].id);
  const [subjectEdit, setSubjectEdit] = useState<string | null>(null);
  const [bodyEdit, setBodyEdit] = useState<string | null>(null);
  const inquiry = inquiries.find(i => i.id === inquiryId);
  const template = emailTemplates.find(t => t.id === templateId)!;
  if (!inquiry) return <p>No inquiries are available for a response.</p>;
  const subject = subjectEdit ?? personaliseEmail(template.subject, inquiry);
  const body = bodyEdit ?? personaliseEmail(template.body, inquiry);
  return <form action={action} className="email-card">
    <h2>Prepare a response</h2><input type="hidden" name="id" value={state.nextId ?? draftId} />
    <div className="field"><label htmlFor="response-inquiry">Project inquiry</label><select id="response-inquiry" name="inquiryId" value={inquiryId} onChange={e => { setInquiryId(e.target.value); setSubjectEdit(null); setBodyEdit(null); }}>{inquiries.map(i => <option key={i.id} value={i.id}>{i.reference} · {i.name}</option>)}</select><small>To: {inquiry.email}</small></div>
    <div className="field"><label htmlFor="response-template">Start with a template</label><select id="response-template" value={templateId} onChange={e => { setTemplateId(e.target.value); setSubjectEdit(null); setBodyEdit(null); }}>{emailTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
    <div className="field"><label htmlFor="response-subject">Subject</label><input id="response-subject" name="subject" value={subject} onChange={e => setSubjectEdit(e.target.value)} maxLength={200} required /></div>
    <div className="field"><label htmlFor="response-body">Message</label><textarea id="response-body" name="body" value={body} onChange={e => setBodyEdit(e.target.value)} maxLength={10000} required /></div>
    <button className="button button-primary" disabled={pending}>{pending ? "Saving…" : "Save approval draft"}</button>
    {state.error && <p role="alert" className="control-error">{state.error}</p>}{state.success && <p role="status" className="control-success">{state.success}</p>}
  </form>;
}
export function ApproveEmailButton({ id, enabled }: { id: string; enabled: boolean }) {
  const [state, action, pending] = useActionState(approveEmail, initial);
  return <form action={action}><input type="hidden" name="id" value={id} /><button disabled={pending || !enabled} className="button button-primary">{pending ? "Sending…" : "Approve & send email"}</button>{!enabled && <p className="form-note">Email delivery is not configured.</p>}{state.error && <p role="alert" className="control-error">{state.error}</p>}{state.success && <p role="status" className="control-success">{state.success}</p>}</form>;
}
