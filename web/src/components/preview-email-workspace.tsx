"use client";

import { useState, useSyncExternalStore } from "react";
import { Mail, Check, Play } from "lucide-react";
import { previewInquiries } from "@/lib/staff-preview";
import { personaliseEmail } from "@/lib/email-templates";
import { usePreviewEmail, type PreviewEmail } from "./preview-email-provider";

const subscribe = () => () => {};
export function PreviewEmailWorkspace({ mode, inquiryId }: { mode: "templates" | "automations"; inquiryId?: string }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const { templates, setTemplates, messages, setMessages, rules, setRules } = usePreviewEmail();
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [recipientId, setRecipientId] = useState(previewInquiries.find(i => i.id === inquiryId)?.id ?? previewInquiries[0].id);
  const [feedback, setFeedback] = useState("");
  const template = templates.find(t => t.id === templateId)!;
  const inquiry = previewInquiries.find(i => i.id === recipientId)!;
  const subject = personaliseEmail(template.subject, inquiry);
  const body = personaliseEmail(template.body, inquiry);
  const valid = subject.trim().length > 0 && body.trim().length > 0 && !/{{.*?}}/.test(subject + body);
  function createDraft() {
    if (!valid) return;
    setMessages(current => [{ id: crypto.randomUUID(), inquiryId: inquiry.id, recipient: inquiry.email, subject, body, status: "Awaiting approval", source: template.name }, ...current]);
    setFeedback("Draft added to the approval queue. No email has been sent.");
  }
  function simulate(ruleId: string) {
    const rule = rules.find(r => r.id === ruleId)!;
    if (!rule.enabled) return;
    const eventKey = rule.id + ":" + inquiry.id;
    if (messages.some(message => message.eventKey === eventKey)) { setFeedback("This event has already been processed for this inquiry."); return; }
    const selected = templates.find(t => t.id === rule.templateId)!;
    const renderedSubject = personaliseEmail(selected.subject, inquiry), renderedBody = personaliseEmail(selected.body, inquiry);
    if (!renderedSubject.trim() || !renderedBody.trim() || /{{.*?}}/.test(renderedSubject + renderedBody)) { setFeedback("Complete the template and resolve its placeholders before testing."); return; }
    const message: PreviewEmail = { id: crypto.randomUUID(), inquiryId: inquiry.id, recipient: inquiry.email, subject: renderedSubject, body: renderedBody, source: rule.name, eventKey, status: rule.requireApproval ? "Awaiting approval" : "Simulated sent" };
    setMessages(current => current.some(m => m.eventKey === eventKey) ? current : [message, ...current]);
    setFeedback(rule.requireApproval ? "Automation test created a draft for approval." : "Automation test recorded a simulated send. No email was delivered.");
  }
  return <fieldset disabled={!ready} className="staff-workspace preview-email-workspace">
    <header className="staff-page-header"><span className="eyebrow purple">Client communication</span><h1>{mode === "templates" ? "Email templates" : "Email automation"}</h1><p>{mode === "templates" ? "Write once, personalise for each project, then review before sending." : "Connect a project event to a useful response."}</p></header>
    <div className="email-summary"><span><strong>{templates.length}</strong> Templates</span><span><strong>{messages.filter(m => m.status === "Awaiting approval").length}</strong> Awaiting approval</span><span><strong>{messages.filter(m => m.status === "Simulated sent").length}</strong> Simulated sends</span><span><strong>{rules.filter(r => r.enabled).length}</strong> Preview rules enabled</span></div>
    <p className="email-preview-notice"><Mail size={18} aria-hidden="true" />Preview only. Changes last until refresh. Live delivery needs a verified sender and email provider.</p>
    <div className="email-recipient field"><label htmlFor="email-recipient">Preview recipient</label><select id="email-recipient" value={recipientId} onChange={e => { setRecipientId(e.target.value); setFeedback(""); }}>{previewInquiries.map(i => <option key={i.id} value={i.id}>{i.name} · {i.company}</option>)}</select></div>
    {mode === "templates" ? <div className="email-editor-grid">
      <section className="email-card"><h2>Response template</h2><div className="field"><label htmlFor="template">Template</label><select id="template" value={templateId} onChange={e => { setTemplateId(e.target.value); setFeedback(""); }}>{templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div><div className="field"><label htmlFor="email-subject">Subject</label><input id="email-subject" maxLength={200} value={template.subject} onChange={e => setTemplates(current => current.map(t => t.id === templateId ? { ...t, subject: e.target.value } : t))} /></div><div className="field"><label htmlFor="email-body">Message</label><textarea id="email-body" maxLength={10000} value={template.body} onChange={e => setTemplates(current => current.map(t => t.id === templateId ? { ...t, body: e.target.value } : t))} /><small>Personalisation: {"{{first_name}}"}, {"{{company}}"}, {"{{reference}}"}. Edits update this preview session automatically.</small></div></section>
      <section className="email-card email-render"><span className="eyebrow purple">Recipient preview</span><h2>{subject || "Add a subject"}</h2><p className="email-to">To: {inquiry.email}</p><div className="email-body">{body}</div><button className="button button-primary" disabled={!valid} onClick={createDraft}>Create approval draft</button>{!valid && <p className="control-error">Add a subject and message, and use only the supported placeholders.</p>}</section>
    </div> : <div className="automation-rules">{rules.map(rule => <section className="email-card" key={rule.id}><div className="rule-heading"><h2>{rule.name}</h2><span className={rule.enabled ? "status-badge status-contacted" : "status-badge"}>{rule.enabled ? "Preview enabled" : "Paused"}</span></div><p>{rule.trigger}</p><div className="rule-flow"><span>Event</span><span aria-hidden="true">→</span><span>{templates.find(t => t.id === rule.templateId)?.name}</span><span aria-hidden="true">→</span><span>{rule.requireApproval ? "Approval queue" : "Simulated send"}</span></div><label className="rule-option"><input type="checkbox" checked={rule.enabled} onChange={e => setRules(current => current.map(r => r.id === rule.id ? { ...r, enabled: e.target.checked } : r))} />Enable this preview rule</label><label className="rule-option"><input type="checkbox" disabled={rule.id === "follow-up"} checked={rule.requireApproval} onChange={e => setRules(current => current.map(r => r.id === rule.id ? { ...r, requireApproval: e.target.checked } : r))} />Require staff approval</label><button className="button button-quiet" disabled={!rule.enabled} onClick={() => simulate(rule.id)}><Play size={16} aria-hidden="true" />Test event</button><small>Manual simulation for the selected recipient. Repeating the same event will not create another message.</small></section>)}</div>}
    {feedback && <p className="email-feedback" role="status">{feedback}</p>}
    <section className="email-queue"><div className="rule-heading"><h2>Approval queue &amp; history</h2><span>{messages.length} messages</span></div>{messages.length === 0 ? <div className="staff-state"><h3>No email drafts yet</h3><p>Create a response draft or test a preview automation to see it here.</p></div> : messages.map(message => <article className="email-card" key={message.id}><div className="rule-heading"><h3>{message.subject}</h3><span className="status-badge">{message.status}</span></div><p className="email-to">{message.recipient} · {message.source}</p><details><summary>Review message</summary><div className="email-body">{message.body}</div></details>{message.status === "Awaiting approval" && <button className="button button-primary" onClick={() => { setMessages(current => current.map(m => m.id === message.id ? { ...m, status: "Simulated sent" } : m)); setFeedback("Approved and simulated. No real email was sent."); }}><Check size={16} aria-hidden="true" />Approve &amp; simulate send</button>}</article>)}</section>
  </fieldset>;
}
