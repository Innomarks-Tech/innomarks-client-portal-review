"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { emailTemplates, type EmailTemplate } from "@/lib/email-templates";

export type PreviewEmail = { id: string; inquiryId: string; recipient: string; subject: string; body: string; status: "Awaiting approval" | "Simulated sent"; source: string; eventKey?: string };
export type PreviewRule = { id: string; name: string; trigger: string; templateId: string; enabled: boolean; requireApproval: boolean };
const initialRules: PreviewRule[] = [
  { id: "receipt", name: "Acknowledge a new enquiry", trigger: "New enquiry received", templateId: "acknowledgement", enabled: false, requireApproval: false },
  { id: "follow-up", name: "Follow up after first contact", trigger: "Follow-up due (3 days after contact)", templateId: "follow-up", enabled: false, requireApproval: true },
];
type Store = {
  templates: EmailTemplate[]; setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>;
  messages: PreviewEmail[]; setMessages: React.Dispatch<React.SetStateAction<PreviewEmail[]>>;
  rules: PreviewRule[]; setRules: React.Dispatch<React.SetStateAction<PreviewRule[]>>;
};
const EmailContext = createContext<Store | null>(null);
export function PreviewEmailProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState(emailTemplates);
  const [messages, setMessages] = useState<PreviewEmail[]>([]);
  const [rules, setRules] = useState(initialRules);
  return <EmailContext.Provider value={{ templates, setTemplates, messages, setMessages, rules, setRules }}>{children}</EmailContext.Provider>;
}
export function usePreviewEmail() {
  const context = useContext(EmailContext);
  if (!context) throw new Error("Preview email requires the development provider.");
  return context;
}
