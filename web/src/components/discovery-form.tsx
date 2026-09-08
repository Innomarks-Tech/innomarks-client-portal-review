"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services";
import { budgets, timeframes, inquirySchema } from "@/lib/inquiry";

const steps = ["Your project", "Your details", "Review & send"];
export function DiscoveryForm({ initialService, enabled }: { initialService?: string; enabled: boolean }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    services: initialService ? [initialService] : [] as string[],
    description: "", budget: budgets[0] as string, timeframe: timeframes[0] as string,
    name: "", email: "", company: "", consent: false, website: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState("");
  const requestId = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  function go(next: number) {
    setError(""); setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function fail(message: string) {
    setError(message);
    requestAnimationFrame(() => errorBox.current?.focus());
  }
  function change(key: keyof typeof values, value: string | string[] | boolean) {
    setValues(current => ({ ...current, [key]: value }));
    requestId.current = null;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const schema = step === 0 ? inquirySchema.pick({ services: true, description: true, budget: true, timeframe: true })
      : step === 1 ? inquirySchema.pick({ name: true, email: true, company: true }) : inquirySchema;
    const parsed = schema.safeParse(values);
    if (!parsed.success) { fail(parsed.error.issues.map(issue => issue.message).join(" ")); return; }
    if (step < 2) { go(step + 1); return; }
    if (!enabled) { fail("Online enquiries are not available yet. Your brief has not been sent. You can email info@innomarkstech.co.za instead."); return; }
    setPending(true); setError("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId: requestId.current }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || !result.reference) { fail(result.error || "We could not confirm receipt. Keep this page open and try again."); return; }
      setReference(result.reference);
      requestAnimationFrame(() => heading.current?.focus());
    } catch {
      fail("We could not confirm receipt. Your answers are still here. Check your connection and try again; retrying the same brief will not create a duplicate.");
    } finally { setPending(false); }
  }

  if (reference) return <div className="form-panel">
    <CheckCircle2 size={38} aria-hidden="true" />
    <h2 ref={heading} tabIndex={-1}>Your enquiry is with us.</h2>
    <p>Thank you, {values.name}. The team can now review your project and contact you at {values.email}.</p>
    <p className="form-note">Reference: {reference}. Keep this reference for follow-up. An enquiry is not a booking or a quote.</p>
    <Link className="button button-primary" href="/">Back to home</Link>
  </div>;

  return <>
    <ol className="form-progress" aria-label="Enquiry progress">{steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}>{index + 1}. {label}</li>)}</ol>
    {!enabled && <p className="form-note">You can explore and prepare your brief. Online sending is being set up; for now, contact <a href="mailto:info@innomarkstech.co.za">info@innomarkstech.co.za</a>.</p>}
    <form className="form-panel" onSubmit={submit}>
      <h2 ref={heading} tabIndex={-1}>{["What would you like to work on?", "How can we reach you?", "Does everything look right?"][step]}</h2>
      <p className="form-note">{step === 0 ? "You don’t need a finished brief. Start with the challenge you want to solve." : step === 1 ? "We’ll use these details to respond to this enquiry." : "Check your brief before sending. You can go back and edit either section."}</p>
      {error && <div className="error-message" role="alert" tabIndex={-1} ref={errorBox}>{error}</div>}
      {step === 0 && <>
        <fieldset><legend>Where do you need support? (Select at least one)</legend><div className="choice-grid">{services.map(service => <label className="choice" key={service.id}><input type="checkbox" checked={values.services.includes(service.id)} onChange={event => change("services", event.target.checked ? [...values.services, service.id] : values.services.filter(id => id !== service.id))} />{service.name}</label>)}</div></fieldset>
        <div className="field"><label htmlFor="description">Tell us about your project</label><textarea id="description" required minLength={20} maxLength={3000} value={values.description} onChange={event => change("description", event.target.value)} aria-describedby="description-hint" /><small id="description-hint">For example: We track orders in spreadsheets and want a simpler way for our team to see progress. Please leave out passwords, financial records, and other sensitive information.</small><small>{values.description.length}/3,000 characters</small></div>
        <div className="field"><label htmlFor="budget">Approximate budget</label><select id="budget" value={values.budget} onChange={event => change("budget", event.target.value)}>{budgets.map(budget => <option key={budget}>{budget}</option>)}</select><small>A starting point for the conversation, not a price or commitment.</small></div>
        <div className="field"><label htmlFor="timeframe">Ideal timeframe</label><select id="timeframe" value={values.timeframe} onChange={event => change("timeframe", event.target.value)}>{timeframes.map(timeframe => <option key={timeframe}>{timeframe}</option>)}</select></div>
      </>}
      {step === 1 && <>
        <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={values.name} onChange={event => change("name", event.target.value)} /></div>
        <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={event => change("email", event.target.value)} /></div>
        <div className="field"><label htmlFor="company">Business or organisation (optional)</label><input id="company" name="organization" autoComplete="organization" maxLength={150} value={values.company} onChange={event => change("company", event.target.value)} /></div>
      </>}
      {step === 2 && <>
        <dl className="review-list"><dt>Services</dt><dd>{services.filter(service => values.services.includes(service.id)).map(service => service.name).join(", ")}</dd><dt>Your project</dt><dd>{values.description}</dd><dt>Budget / timeframe</dt><dd>{values.budget} / {values.timeframe}</dd><dt>Contact</dt><dd>{values.name}\n{values.email}{values.company ? "\n" + values.company : ""}</dd></dl>
        <div className="form-actions"><button className="button button-quiet" type="button" disabled={pending} onClick={() => go(0)}>Edit project</button><button className="button button-quiet" type="button" disabled={pending} onClick={() => go(1)}>Edit contact details</button></div>
        <label className="consent"><input type="checkbox" checked={values.consent} disabled={pending} onChange={event => change("consent", event.target.checked)} required /><span>I understand that Innomarks Technology Consulting will use these details to respond to my enquiry, as described in the <Link href="/privacy" target="_blank">privacy notice (opens in a new tab)</Link>.</span></label>
      </>}
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => change("website", event.target.value)} /></div>
      <div className="form-actions">{step > 0 ? <button className="button button-quiet" type="button" disabled={pending} onClick={() => go(step - 1)}><ArrowLeft size={16} aria-hidden="true" />Back</button> : <Link className="button button-quiet" href="/">Back to home</Link>}<button className="button button-primary" disabled={pending} type="submit">{pending ? "Sending…" : step === 2 ? "Send enquiry" : "Continue"}<ArrowRight size={16} aria-hidden="true" /></button></div>
      <p className="form-note">Your draft stays in this tab while you move between steps. Refreshing or closing the page clears it.</p>
    </form>
  </>;
}
