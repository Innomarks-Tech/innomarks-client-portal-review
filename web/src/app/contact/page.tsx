import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import styles from "../landing.module.css";

export default function ContactPage() {
  return <>
    <SiteHeader />
    <main id="main-content" className={styles.landing} tabIndex={-1}>
      <section className={`container ${styles.contact} ${styles.contactPage}`} aria-labelledby="contact-title">
        <div>
          <span className="eyebrow purple">Contact us</span>
          <h1 id="contact-title">Let’s talk about<br /><em>what’s next.</em></h1>
          <p>Have a question or prefer a conversation? Get in touch with our Midrand team.</p>
        </div>
        <address className={styles.contactLinks}>
          <a href="tel:+27685986184"><span>Call us</span><strong>068 598 6184</strong></a>
          <a href="mailto:info@innomarkstech.co.za"><span>Email us</span><strong>info@innomarkstech.co.za</strong></a>
          <div><span>Office location</span><strong>Midrand, South Africa</strong></div>
          <a href="https://www.innomarkstech.co.za"><span>Website</span><strong>www.innomarkstech.co.za</strong></a>
        </address>
      </section>
    </main>
    <SiteFooter />
  </>;
}
