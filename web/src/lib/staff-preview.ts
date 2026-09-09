export type PreviewStatus = "New" | "Contacted" | "Proposal Sent";

export type PreviewActivity = {
  id: string;
  type: "inquiry_received" | "status_changed" | "note_added";
  at: string;
  actor?: string;
  previousStatus?: PreviewStatus;
  newStatus?: PreviewStatus;
  note?: string;
};

export type PreviewInquiry = {
  id: string;
  reference: string;
  name: string;
  company?: string;
  email: string;
  serviceIds: string[];
  description: string;
  budget: string;
  timeframe: string;
  status: PreviewStatus;
  receivedAt: string;
  activities: PreviewActivity[];
};

export const previewInquiries: PreviewInquiry[] = [
  {
    id: "north-star-logistics",
    reference: "INQ-26-A14F82C9",
    name: "Thabo Molefe",
    company: "Northern Star Logistics",
    email: "thabo@example.com",
    serviceIds: ["software", "data"],
    description: "We currently track inventory manually across three depots. We need an internal platform that gives managers a clearer view of stock movement, exceptions and weekly reporting.",
    budget: "R30,000–R75,000",
    timeframe: "1–3 months",
    status: "New",
    receivedAt: "2026-09-08T12:32:00+02:00",
    activities: [{ id: "north-received", type: "inquiry_received", at: "2026-09-08T12:32:00+02:00" }],
  },
  {
    id: "khula-learning-hub",
    reference: "INQ-26-73BD194E",
    name: "Naledi Maseko",
    company: "Khula Learning Hub",
    email: "naledi@example.com",
    serviceIds: ["consulting", "transformation"],
    description: "Our enrolment and learner-support processes have grown across spreadsheets and email. We want to map a practical digital roadmap before choosing any new systems.",
    budget: "Not sure yet",
    timeframe: "3–6 months",
    status: "Contacted",
    receivedAt: "2026-09-07T09:15:00+02:00",
    activities: [
      { id: "khula-contacted", type: "status_changed", at: "2026-09-08T10:05:00+02:00", actor: "Preview Staff", previousStatus: "New", newStatus: "Contacted" },
      { id: "khula-note", type: "note_added", at: "2026-09-08T09:58:00+02:00", actor: "Preview Staff", note: "Initial discussion arranged for Thursday morning." },
      { id: "khula-received", type: "inquiry_received", at: "2026-09-07T09:15:00+02:00" },
    ],
  },
  {
    id: "cedarline-foods",
    reference: "INQ-26-CC58E210",
    name: "Ayesha Khan",
    company: "Cedarline Foods",
    email: "ayesha@example.com",
    serviceIds: ["automation", "security"],
    description: "We want to reduce repetitive supplier onboarding work while keeping approvals, document handling and access controls clear for the operations team.",
    budget: "R75,000+",
    timeframe: "Within a month",
    status: "Proposal Sent",
    receivedAt: "2026-09-04T14:40:00+02:00",
    activities: [
      { id: "cedar-proposal", type: "status_changed", at: "2026-09-08T15:20:00+02:00", actor: "Preview Staff", previousStatus: "Contacted", newStatus: "Proposal Sent" },
      { id: "cedar-contacted", type: "status_changed", at: "2026-09-05T11:10:00+02:00", actor: "Preview Staff", previousStatus: "New", newStatus: "Contacted" },
      { id: "cedar-received", type: "inquiry_received", at: "2026-09-04T14:40:00+02:00" },
    ],
  },
];

export function staffPreviewEnabled() {
  return process.env.NODE_ENV === "development";
}
