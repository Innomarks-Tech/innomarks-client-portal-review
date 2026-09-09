import "server-only";

function toOrigin(value: string | undefined, addProtocol = false) {
  if (!value) return null;
  try {
    return new URL(addProtocol ? `https://${value}` : value).origin;
  } catch {
    return null;
  }
}

export function allowedIntakeOrigins() {
  return new Set([
    toOrigin(process.env.SITE_URL),
    toOrigin(process.env.VERCEL_URL, true),
    toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL, true),
  ].filter((origin): origin is string => Boolean(origin)));
}

export function intakeEnabled() {
  return process.env.INQUIRIES_ENABLED === "true" &&
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY && process.env.RATE_LIMIT_SECRET) &&
    allowedIntakeOrigins().size > 0;
}
