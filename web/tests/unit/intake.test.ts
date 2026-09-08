import { beforeEach, describe, expect, it, vi } from "vitest";
const { rpc, notify, after } = vi.hoisted(() => ({ rpc: vi.fn(), notify: vi.fn(), after: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/database", () => ({ database: () => ({ rpc }) }));
vi.mock("@/lib/server/notifications", () => ({ notifyInquiry: notify }));
vi.mock("next/server", () => ({ after }));
import { POST } from "@/app/api/inquiries/route";
import { inquirySchema } from "@/lib/inquiry";

const valid = {
  requestId: "c29d147b-1a57-4125-a150-dee9bb3d59fe",
  services: ["software"], description: "We need a clearer way to manage customer requests.",
  budget: "Not sure yet", timeframe: "Flexible / not sure yet", name: "Test Visitor",
  email: "visitor@example.test", company: "", consent: true, website: "",
};
function request(body: unknown = valid, origin = "https://example.test") {
  return new Request("https://example.test/api/inquiries", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("INQUIRIES_ENABLED", "true");
  vi.stubEnv("SUPABASE_URL", "https://example.test");
  vi.stubEnv("SUPABASE_SECRET_KEY", "synthetic-test-key");
  vi.stubEnv("RATE_LIMIT_SECRET", "synthetic-test-secret");
  vi.stubEnv("SITE_URL", "https://example.test");
  vi.stubEnv("VERCEL", "0");
  rpc.mockResolvedValue({ data: "e9d8acd4-6c2c-4a31-b0c5-af342b182644", error: null });
});
describe("enquiry boundary", () => {
  it("fails closed before configuration", async () => {
    vi.stubEnv("INQUIRIES_ENABLED", "false");
    expect((await POST(request())).status).toBe(503); expect(rpc).not.toHaveBeenCalled();
  });
  it("rejects cross-origin and missing origin requests", async () => {
    expect((await POST(request(valid, "https://other.test"))).status).toBe(403);
    const req = request(); req.headers.delete("origin");
    expect((await POST(req)).status).toBe(403); expect(rpc).not.toHaveBeenCalled();
  });
  it("rejects unknown service, duplicate selection and missing acknowledgement", () => {
    expect(inquirySchema.safeParse({ ...valid, services: ["branding"] }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, services: ["software", "software"] }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
  it("rejects invalid JSON, honeypot and oversized actual body", async () => {
    const req = request(); const broken = new Request(req.url, { method: "POST", headers: req.headers, body: "{" });
    expect((await POST(broken)).status).toBe(400);
    expect((await POST(request({ ...valid, website: "spam" }))).status).toBe(400);
    expect((await POST(request({ ...valid, description: "x".repeat(17000) }))).status).toBe(413);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("returns success only after persistence and strips unrecognised input", async () => {
    const result = await POST(request({ ...valid, admin: true }));
    expect(result.status).toBe(201);
    expect(result.headers.get("cache-control")).toBe("no-store");
    const args = rpc.mock.calls[0][1];
    expect(args.p_payload.admin).toBeUndefined();
    expect(args.p_payload.website).toBeUndefined();
    expect(args.p_bucket).toMatch(/^[a-f0-9]{64}$/);
    expect(after).toHaveBeenCalledOnce();
  });
  it("returns a retryable failure and never sends after failed persistence", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "private connection detail" } });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("private connection");
    expect(after).not.toHaveBeenCalled();
  });
  it("maps database rate limiting and idempotency conflicts", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "RATE_LIMITED" } });
    expect((await POST(request())).status).toBe(429);
    rpc.mockResolvedValue({ data: null, error: { message: "REQUEST_CONFLICT" } });
    expect((await POST(request())).status).toBe(409);
  });
});
