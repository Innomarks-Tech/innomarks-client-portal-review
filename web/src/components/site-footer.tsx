import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div><Brand /><p>Clear thinking. Thoughtful design.<br />A better next step.</p></div>
        <div className="footer-links"><span className="eyebrow">Explore</span><Link href="/#services">Our services</Link><Link href="/#approach">Our approach</Link><Link href="/project-discovery">Start a project <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
        <div className="footer-links"><span className="eyebrow">Get in touch</span><a href="mailto:info@innomarkstech.co.za">info@innomarkstech.co.za</a><Link href="/privacy">Privacy</Link><span>Midrand, South Africa</span></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Innomarks Technology Consulting</span><span>A division under Innomarks Group</span><a href="#main-content">Back to top ↑</a></div>
    </footer>
  );
}
