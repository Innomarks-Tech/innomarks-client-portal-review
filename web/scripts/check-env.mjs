const enabled = (name) => process.env[name] === "true";
const present = (name) => Boolean(process.env[name]?.trim());
const missing = [];

if (enabled("INQUIRIES_ENABLED")) {
  for (const name of ["SUPABASE_URL", "SUPABASE_SECRET_KEY", "RATE_LIMIT_SECRET"]) {
    if (!present(name)) missing.push(name);
  }
  const hasOrigin = present("SITE_URL") || (process.env.VERCEL === "1" && (present("VERCEL_URL") || present("VERCEL_PROJECT_PRODUCTION_URL")));
  if (!hasOrigin) missing.push("SITE_URL or a Vercel system URL");
  if ((process.env.RATE_LIMIT_SECRET?.length ?? 0) < 32) missing.push("RATE_LIMIT_SECRET (minimum 32 characters)");
}

if (enabled("NOTIFICATIONS_ENABLED") || enabled("STAFF_EMAIL_ENABLED")) {
  for (const name of ["RESEND_API_KEY", "RESEND_FROM", "RESEND_REPLY_TO"]) {
    if (!present(name)) missing.push(name);
  }
}

if (enabled("NOTIFICATIONS_ENABLED") && !present("INQUIRY_NOTIFICATION_TO")) {
  missing.push("INQUIRY_NOTIFICATION_TO");
}

if (enabled("STAFF_EMAIL_ENABLED") && !present("CRON_SECRET")) {
  missing.push("CRON_SECRET");
}

if (missing.length) {
  console.error(`Environment configuration is incomplete: ${[...new Set(missing)].join(", ")}`);
  process.exit(1);
}

console.log(`Environment configuration is valid. Intake ${enabled("INQUIRIES_ENABLED") ? "enabled" : "disabled"}; email delivery ${enabled("STAFF_EMAIL_ENABLED") || enabled("NOTIFICATIONS_ENABLED") ? "enabled" : "disabled"}.`);
