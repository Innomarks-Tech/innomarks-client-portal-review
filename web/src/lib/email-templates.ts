export type EmailTemplate = { id: string; name: string; subject: string; body: string };
export const emailTemplates: EmailTemplate[] = [
  { id: "acknowledgement", name: "Enquiry acknowledgement", subject: "We received your project brief — {{reference}}", body: "Hi {{first_name}},\n\nThank you for telling us about your project at {{company}}. We have received your brief ({{reference}}), and our team will review the details.\n\nIf there is anything else you would like us to know, you can reply to this email.\n\nKind regards,\nThe Innomarks Technology Consulting team" },
  { id: "clarify", name: "Clarify the project", subject: "A few questions about your project — {{reference}}", body: "Hi {{first_name}},\n\nThank you for sharing your project with us. We would like to understand your priorities a little better.\n\nWhat is the most important outcome you want to achieve, and who will use the solution day to day?\n\nYour answers will help us prepare for the next conversation.\n\nKind regards,\nThe Innomarks Technology Consulting team" },
  { id: "follow-up", name: "Follow up on a conversation", subject: "Checking in on your project — {{reference}}", body: "Hi {{first_name}},\n\nWe are checking in on your project at {{company}}. Is there anything you would like to clarify or discuss before taking the next step?\n\nLet us know what would be useful.\n\nKind regards,\nThe Innomarks Technology Consulting team" },
];
export function personaliseEmail(text: string, inquiry: { name: string; company?: string; reference: string }) {
  const values: Record<string, string> = { first_name: inquiry.name.trim().split(/\s+/)[0], company: inquiry.company || "your organisation", reference: inquiry.reference };
  return text.replace(/{{\s*(first_name|company|reference)\s*}}/g, (_, key: string) => values[key]);
}
