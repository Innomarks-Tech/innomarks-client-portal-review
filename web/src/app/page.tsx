import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Plus, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceExplorer } from "@/components/service-explorer";
import { ProjectBriefJourney } from "@/components/project-brief-journey";
import styles from "./landing.module.css";
import { LandingMotion, MotionWords, RotatingWord } from "@/components/landing-motion";

import { PartnerStrip } from "@/components/partner-strip";

const faqs = [
  ["I don’t have a complete project brief yet. Can I still enquire?", "Yes. Start with the challenge or outcome you have in mind. Project Discovery helps you organise what you know, and you can review everything before sending."],
  ["Can my project involve more than one service?", "Yes. Choose one service or combine several relevant areas. The discovery form lets you select the support that fits your project."],
  ["What if I don’t know my budget or timeframe?", "That’s okay. Both questions include a ‘not sure yet’ option. They help shape the first conversation; they are not a quote or commitment."],
  ["What happens after I send my project brief?", "Your brief is saved for the Innomarks team to review. The team will follow up using the contact details you provided to clarify the scope and decide whether there is a useful fit."],
] as const;

const principles = [
  ["01", "Understand", "Understand before recommending.", "Technology starts with the business problem, the people involved and the outcome that matters."],
  ["02", "Simplify", "Technology expertise that fits.", "Our partner ecosystem spans Vercel, Supabase, WordPress, WP Engine, MongoDB, AWS, Google Cloud, HubSpot and Google Workspace. We choose the tools that fit your business."],
  ["03", "Grow", "Experience you can build on.", "60+ happy clients. We bring a business perspective to every interaction, with practical solutions and room for your organisation to grow."],
] as const;

const placeholderTestimonials = [
  ["“They turned a complex technology challenge into a clear plan our team could use.”", "Placeholder client · Operations lead"],
  ["“The process was practical, collaborative and focused on the results we needed.”", "Placeholder client · Business owner"],
  ["“We finally had a clear view of what to improve first and why it mattered.”", "Placeholder client · Managing director"],
  ["“The new workflow removed the routine work that had been slowing our team down.”", "Placeholder client · Operations manager"],
  ["“Every recommendation made sense for the way our business actually works.”", "Placeholder client · Founder"],
  ["“We left with a roadmap that was easy to explain to our team and leadership.”", "Placeholder client · Programme lead"],
  ["“The team asked the right questions before recommending any technology.”", "Placeholder client · Head of finance"],
  ["“The solution was useful from day one, without adding unnecessary complexity.”", "Placeholder client · General manager"],
] as const;

export default function Home() {
  return <>
    <SiteHeader />
    <LandingMotion />
    <main id="main-content" className={styles.landing} tabIndex={-1}>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <span className="eyebrow purple">Technology &amp; business consulting</span>
          <h1 id="hero-title" data-motion="words"><MotionWords text="Technology that moves your business" /> <RotatingWord /></h1>
          <p>Strategy, software, data, automation and digital transformation — built around how your business actually works.</p>
          <div className="hero-actions hero-actions-left">
            <Link href="/project-discovery" className="button button-primary button-large">Tell us about your project <ArrowUpRight size={20} aria-hidden="true" /></Link>
            <a href="#services" className="button button-quiet">Explore what we do <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className="hero-reassurance hero-reassurance-left"><span><Check size={14} aria-hidden="true" /> No perfect brief needed</span><span><Check size={14} aria-hidden="true" /> Start with an idea or challenge</span></div>
        </div>
        <aside className={styles.heroIllustration} data-motion="right" data-delay="250" aria-label="An example of a business challenge becoming a digital solution">
          <span className="eyebrow purple">A clearer way forward</span>
          <p className={styles.heroQuote}>“There has to be a<br />better way to do this.”</p>
          <div className={styles.heroPath}><span>Your challenge</span><ArrowRight size={18} aria-hidden="true" /><span>Our expertise</span></div>
          <div className={styles.heroResult}><span className={styles.resultIcon}><Check size={22} aria-hidden="true" /></span><div><strong>Technology that fits.</strong><p>A practical plan. A useful solution.<br />A better way of working.</p></div></div>
          <span className={styles.heroCaption}>Strategy · Build · Improve</span>
        </aside>
      </section>

      <ServiceExplorer />

      <section id="about" className="section about-new container" aria-labelledby="about-title">
        <div className="about-new-copy" data-motion="left">
          <span className="eyebrow purple">About Innomarks</span>
          <h2 id="about-title">Technology expertise.<br /><em>Business perspective.</em></h2>
          <p>Innomarks Technology Consulting is the technology and business consulting division of Innomarks Group. We help organisations make practical technology decisions, improve operations and build useful digital solutions.</p>
          <p>With 60+ happy clients, our work begins with the business context: the people doing the work, the friction they face and the outcome that needs to change. From cloud infrastructure and custom software to customer platforms and collaboration tools, our technology partnerships help us connect the right expertise to your goals.</p>
        </div>
        <aside className={styles.aboutPanel} data-motion="right">
          <span className="eyebrow purple">Part of Innomarks Group</span>
          <strong className={styles.clientCount}>60+</strong><h3>Happy clients.<br />Practical technology.</h3>
          <p>Our technology and business consulting division connects strategy with the practical work of improving how organisations operate.</p>
          <span>Innomarks Technology Consulting</span>
        </aside>
      </section>

      <PartnerStrip />

      <ProjectBriefJourney />

      <section id="value" className="section value-section container" aria-labelledby="value-title">
        <div className="value-intro" data-motion="left"><span className="eyebrow purple">Why Innomarks</span><h2 id="value-title">Built around the problem,<br /><em>not the technology.</em></h2><div className={styles.testimonials}><div className={styles.testimonialViewport} aria-label="Sample client feedback"><div className={styles.testimonialTrack}>{[0, 1].map((copy) => <div key={copy} className={styles.testimonialGroup} aria-hidden={copy === 1 ? true : undefined}>{placeholderTestimonials.map(([quote, attribution]) => <figure key={`${copy}-${attribution}`}><blockquote>{quote}</blockquote><figcaption>{attribution}</figcaption></figure>)}</div>)}</div></div></div></div>
        <div className="principle-grid">{principles.map(([number, label, title, copy]) => <article key={number} className="principle" data-motion="up" data-delay={Number(number) * 90}><div><span className="eyebrow">{label}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section id="faqs" className="section faq-section container" aria-labelledby="faq-title"><div><span className="eyebrow purple">Before you begin</span><h2 id="faq-title">Questions that may be <em>holding you back.</em></h2><p>Project Discovery is designed for an early idea as much as a finished brief.</p></div><div className="faq-list" data-motion="up">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

      <section className="closing-cta container" data-motion="up" aria-labelledby="closing-title"><span className="eyebrow purple">Start project discovery</span><h2 id="closing-title">Have something you want to <em>move forward?</em></h2><p>Tell us what you’re trying to achieve. Organise your ideas, review the brief and send it when you’re ready.</p><Link href="/project-discovery" className="button button-primary button-large">Tell us about your project <ArrowUpRight size={20} aria-hidden="true" /></Link><span className="closing-note">A few minutes · No perfect brief required · Review before sending</span></section>
    </main>
    <SiteFooter />
  </>;
}
