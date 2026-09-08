import { z } from "zod";
import { isServiceId } from "./services";

export const budgets = ["Not sure yet", "Under R10,000", "R10,000–R30,000", "R30,000–R75,000", "R75,000+"] as const;
export const timeframes = ["Flexible / not sure yet", "Within a month", "1–3 months", "3–6 months", "More than 6 months"] as const;
export const inquirySchema = z.object({
  services: z.array(z.string().refine(isServiceId, "Choose a listed service.")).min(1, "Choose at least one service.").max(6).refine(values => new Set(values).size === values.length, "Choose each service once."),
  description: z.string().trim().min(20, "Tell us a little more about your project (at least 20 characters).").max(3000, "Keep your description under 3,000 characters."),
  budget: z.enum(budgets),
  timeframe: z.enum(timeframes),
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
  company: z.string().trim().max(150),
  consent: z.literal(true, { error: "Please acknowledge how we will use your enquiry details." }),
});
export const submissionSchema = inquirySchema.extend({
  requestId: z.uuid(),
  website: z.string().max(200).default(""),
});
export type Inquiry = z.infer<typeof inquirySchema>;
