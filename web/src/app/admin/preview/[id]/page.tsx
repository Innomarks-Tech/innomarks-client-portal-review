import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { PreviewInquiryControls } from "@/components/preview-inquiry-controls";
import { previewInquiries } from "@/lib/staff-preview";
import { services } from "@/lib/services";

export default async function StaffPreviewInquiryPage({ params }: PageProps<"/admin/preview/[id]">) {
  const { id } = await params;
  const inquiry = previewInquiries.find((item) => item.id === id);
  if (!inquiry) notFound();
  const selectedServices = services.filter((service) => inquiry.serviceIds.includes(service.id));
  return <div className="staff-workspace inquiry-page"><Link className="back-link" href="/admin/preview"><ArrowLeft size={16} aria-hidden="true" />Back to project inquiries</Link><header className="inquiry-header"><span className="eyebrow purple">{inquiry.reference}</span><h1>{inquiry.company || inquiry.name}</h1><p>{inquiry.description}</p><time dateTime={inquiry.receivedAt}>Received {new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "long", timeStyle: "short" }).format(new Date(inquiry.receivedAt))}</time></header><div className="inquiry-layout"><div className="inquiry-main"><section className="project-brief-card" aria-labelledby="preview-brief-title"><div><span className="eyebrow purple">Project brief</span><h2 id="preview-brief-title">What they need</h2></div><dl><div><dt>Services</dt><dd>{selectedServices.map((service) => service.name).join(", ")}</dd></div><div><dt>What they want to achieve</dt><dd className="brief-quote">{inquiry.description}</dd></div><div><dt>Budget</dt><dd>{inquiry.budget}</dd></div><div><dt>Timeframe</dt><dd>{inquiry.timeframe}</dd></div></dl></section><Link className="button button-primary" href={`/admin/preview/email-templates?inquiry=${inquiry.id}`}>Prepare email response</Link><PreviewInquiryControls inquiry={inquiry} /></div><aside className="inquiry-aside"><section className="contact-card"><span className="eyebrow purple">Contact</span><h2>{inquiry.name}</h2>{inquiry.company && <p>{inquiry.company}</p>}<span className="preview-contact"><Mail size={15} aria-hidden="true" />{inquiry.email}</span></section><div className="preview-safety-card"><strong>Fictional contact</strong><p>This address is displayed for layout review and is not an active contact action.</p></div></aside></div></div>;
}
