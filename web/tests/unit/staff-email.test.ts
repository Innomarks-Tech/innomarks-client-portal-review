import { beforeEach, describe, expect, it, vi } from "vitest";
const { rpc, update, finalEq } = vi.hoisted(() => ({ rpc: vi.fn(), update: vi.fn(), finalEq: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/database", () => ({ database: () => ({ rpc, from: () => ({ update }) }) }));
import { dispatchStaffEmail } from "@/lib/server/staff-email";
import { personaliseEmail } from "@/lib/email-templates";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("STAFF_EMAIL_ENABLED", "true");
  vi.stubEnv("RESEND_API_KEY", "synthetic-test-key");
  vi.stubEnv("RESEND_FROM", "Innomarks Development <onboarding@resend.dev>");
  vi.stubEnv("RESEND_REPLY_TO", "controlled@example.test");
  vi.stubEnv("RESEND_TEST_RECIPIENT", "");
  finalEq.mockResolvedValue({ error: null });
  update.mockReturnValue({ eq: () => ({ eq: finalEq }) });
  rpc.mockResolvedValue({ data: [{ id: "job-1", recipient: "controlled@example.test", subject: "Example", body: "Plain text", lease_token: "lease-1", attempts: 1 }], error: null });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ id: "provider-1" })));
});
describe("staff email sending boundary", () => {
  it("never contacts Resend while disabled", async () => {
    vi.stubEnv("STAFF_EMAIL_ENABLED", "false");
    expect(await dispatchStaffEmail("job-1")).toBe(false);
    expect(rpc).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not send a draft that cannot be claimed", async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    expect(await dispatchStaffEmail("job-1")).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("uses the agreed sender, a stable retry key, and records acceptance", async () => {
    expect(await dispatchStaffEmail("job-1")).toBe(true);
    const init = vi.mocked(fetch).mock.calls[0][1]!;
    expect(JSON.parse(String(init.body))).toMatchObject({ from: "Innomarks Development <onboarding@resend.dev>", to: ["controlled@example.test"], reply_to: "controlled@example.test" });
    expect(init.headers).toMatchObject({ "Idempotency-Key": "staff-email/job-1" });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ state: "accepted", provider_id: "provider-1" }));
    expect(finalEq).toHaveBeenCalledWith("lease_token", "lease-1");
  });
  it("routes development delivery to the configured test inbox", async () => {
    vi.stubEnv("RESEND_TEST_RECIPIENT", "owner@example.test");
    expect(await dispatchStaffEmail("job-1")).toBe(true);
    const init = vi.mocked(fetch).mock.calls[0][1]!;
    expect(JSON.parse(String(init.body)).to).toEqual(["owner@example.test"]);
  });
  it("retains failed work rather than claiming it was sent", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network unavailable"));
    expect(await dispatchStaffEmail("job-1")).toBe(false);
    expect(update).toHaveBeenCalledWith({ state: "failed" });
  });
  it("personalises supported fields without evaluating content", () => {
    expect(personaliseEmail("Hi {{first_name}} at {{company}} — {{reference}}", { name: "Naledi Maseko", company: "Khula", reference: "INQ-26-TEST" })).toBe("Hi Naledi at Khula — INQ-26-TEST");
    expect(personaliseEmail("{{unknown}}", { name: "Test", reference: "ref" })).toBe("{{unknown}}");
  });
});
