import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DiscoveryForm } from "@/components/discovery-form";
import { isServiceId } from "@/lib/services";
import { intakeEnabled } from "@/lib/server/intake-config";

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="container form-page">
    <span className="eyebrow purple">LET’S FIND YOUR NEXT STEP</span>
    <h1>A good conversation<br />starts <em>right here.</em></h1>
    <p className="form-intro">Tell us what you want to improve. We’ll help you explore where technology can make a difference.</p>
    <DiscoveryForm initialService={service && isServiceId(service) ? service : undefined} enabled={intakeEnabled()} />
  </main><SiteFooter /></>;
}
