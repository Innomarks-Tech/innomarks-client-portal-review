"use client";

import Image from "next/image";
import styles from "@/app/landing.module.css";

const partners = [
  ["Vercel", "vercel"], ["Supabase", "supabase"], ["WordPress", "wordpress"],
  ["WP Engine", "wpengine"], ["MongoDB", "mongodb"], ["AWS", "amazonwebservices"],
  ["Google Cloud", "googlecloud"], ["HubSpot", "hubspot"], ["Google Workspace", "google"],
] as const;

export function PartnerStrip() {
  return <section className={styles.partners} aria-label="Our technology partners">
    <div className={styles.partnerViewport} tabIndex={0} aria-label="Technology partners. Focus or hover to pause scrolling.">
      <div className={styles.partnerTrack}>
        {[0, 1].map((copy) => <div key={copy} className={styles.partnerGroup} aria-hidden={copy === 1 ? true : undefined}>{partners.map(([name, icon]) => <div key={name} className={styles.partnerLogo}><Image src={`/partners/${icon}.svg`} alt="" width={32} height={32} /><span>{name}</span></div>)}</div>)}
      </div>
    </div>
  </section>;
}
