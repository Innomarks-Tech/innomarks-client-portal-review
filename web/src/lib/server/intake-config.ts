import "server-only";
export function intakeEnabled() {
  return process.env.INQUIRIES_ENABLED === "true" &&
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY && process.env.RATE_LIMIT_SECRET && process.env.SITE_URL);
}
