import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export default function NotFound() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="container prose"><span className="eyebrow purple">PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page may have moved. Explore our services or tell us about your project.</p><Link className="button button-primary" href="/">Go to home</Link></main><SiteFooter /></>;
}
