import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { database } from "@/lib/server/database";
import { requireStaff } from "@/lib/server/staff-auth";
import { services } from "@/lib/services";
import { InquiryControls } from "@/components/inquiry-controls";

type Payload = { name?: string; company?: string; email?: string; services?: string[]; description?: string; budget?: string; timeframe?: string };
type Activity = { id: number; activity_type: string; previous_status: string | null; new_status: string | null; note_content: string | null; created_at: string; actor_id: string | null };

export default async function InquiryPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireStaff();
  const { id } = await params;
  const [inquiryResult, activityResult] = await Promise.all([
    database().from("inquiries").select("id, public_reference, payload, status, created_at").eq("id", id).maybeSingle(),
    database().from("inquiry_activity").select("id, activity_type, previous_status, new_status, note_content, created_at, actor_id").eq("inquiry_id", id).order("created_at", { ascending: false }),
  ]);
  if (inquiryResult.error || !inquiryResult.data) notFound();
  const inquiry = inquiryResult.data;
  const payload = inquiry.payload as Payload;
  const selectedServices = services.filter((service) => payload.services?.includes(service.id));
  const activities = (activityResult.data ?? []) as Activity[];
  const actorIds = [...new Set(activities.flatMap((activity) => activity.actor_id ? [activity.actor_id] : []))];
  const { data: actors } = actorIds.length ? await database().from("staff_members").select("user_id, display_name").in("user_id", actorIds) : { data: [] as { user_id: string; display_name: string }[] };
  const names = new Map((actors ?? []).map((actor) => [actor.user_id, actor.display_name]));
  const reference = inquiry.public_reference;

  return <div className="staff-workspace inquiry-page"><Link className="back-link" href="/admin/leads"><ArrowLeft size={16} aria-hidden="true" />Back to project inquiries</Link><header className="inquiry-header"><span className="eyebrow purple">{reference}</span><h1>{payload.company || payload.name || "Project inquiry"}</h1><p>{payload.description || "No project description was provided."}</p><span className="status-badge"><span aria-hidden="true">●</span>{inquiry.status}</span><time dateTime={inquiry.created_at}>Received {new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "long", timeStyle: "short" }).format(new Date(inquiry.created_at))}</time></header>
    <div className="inquiry-layout"><div className="inquiry-main"><section className="project-brief-card" aria-labelledby="brief-title"><div><span className="eyebrow purple">Project brief</span><h2 id="brief-title">What they need</h2></div><dl><div><dt>Services</dt><dd>{selectedServices.map((service) => service.name).join(", ") || "Not provided"}</dd></div><div><dt>What they want to achieve</dt><dd className="brief-quote">{payload.description || "Not provided"}</dd></div><div><dt>Budget</dt><dd>{payload.budget || "Not provided"}</dd></div><div><dt>Timeframe</dt><dd>{payload.timeframe || "Not provided"}</dd></div></dl></section><section className="activity-panel" aria-labelledby="activity-title"><span className="eyebrow purple">Activity</span><h2 id="activity-title">What the team has done</h2>{activityResult.error ? <p>Activity could not be loaded.</p> : <ol>{activities.map((activity) => <li key={activity.id}><time dateTime={activity.created_at}>{new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "medium", timeStyle: "short" }).format(new Date(activity.created_at))}</time><div><strong>{activity.activity_type === "inquiry_received" ? "Inquiry received" : activity.activity_type === "status_changed" ? "Status changed" : "Internal note added"}</strong>{activity.actor_id && <span>{names.get(activity.actor_id) || "Staff member"}</span>}{activity.activity_type === "status_changed" && <p>{activity.previous_status} → {activity.new_status}</p>}{activity.note_content && <p>{activity.note_content}</p>}</div></li>)}</ol>}</section></div><aside className="inquiry-aside"><section className="contact-card"><span className="eyebrow purple">Contact</span><h2>{payload.name || "Name not provided"}</h2>{payload.company && <p>{payload.company}</p>}{payload.email && <a href={`mailto:${payload.email}`}><Mail size={15} aria-hidden="true" />{payload.email}</a>}</section><Link className="button button-primary" href={`/admin/leads/email-templates?inquiry=${id}`}>Prepare email response</Link><InquiryControls inquiryId={id} currentStatus={inquiry.status} /></aside></div>
  </div>;
}
