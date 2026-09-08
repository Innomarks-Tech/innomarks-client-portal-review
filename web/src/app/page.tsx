import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Compass, Layers3, Monitor, Plus, Sparkles, Workflow, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServiceExplorer } from "@/components/service-explorer";
import { ProjectArt } from "@/components/project-art";
import { services } from "@/lib/services";

const faqs = [
  ["I have an idea, but not a brief. Can we still talk?", "Absolutely. Start with what you’re trying to achieve, even if the details are still taking shape. The project discovery questions will help you organise your thoughts. You can review everything before sending."],
  ["Can I start with just one service?", "No. Start with the support you need: technology strategy, digital transformation, software, data, automation, or security. If your project connects more than one area, you can select multiple services in your brief."],
  ["Do you work with a particular industry?", "We support businesses across industries. Tell us about your context, your audience, and what you want to change so the approach can be tailored to your needs."],
  ["What if I’m not sure about my budget?", "That’s okay. Choose ‘Not sure yet’ in the project form. A budget range helps shape a conversation; it isn’t a commitment or a final quote."],
  ["What happens after I send a project inquiry?", "Your brief is saved for the team to review. The next step is a conversation to clarify the scope and see what support fits. An inquiry does not create a booking, contract, or payment obligation."],
] as const;

export default function Home() {
  return <>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <div className="hero-landscape">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-eyebrow"><span className="spark-dot" /> A fresh perspective. A connected approach.</div>
          <h1 id="hero-title">Big ideas.<br /><em>Clear next steps.</em><span className="hero-spark" aria-hidden="true">✳</span></h1>
          <p className="hero-description">Technology, people, and possibility — connected.<br className="desktop-break" /> We bring the pieces together, so you can move forward.</p>
          <div className="hero-actions"><Link href="/project-discovery" className="button button-primary button-large">Start your project <ArrowUpRight size={20} aria-hidden="true" /></Link><a href="#services" className="button button-quiet">Explore our services <ArrowDown size={17} aria-hidden="true" /></a></div>
          <div className="hero-reassurance"><span><Check size={14} aria-hidden="true" /> No perfect brief needed</span><span><Check size={14} aria-hidden="true" /> Your goals come first</span></div>
          <span className="hero-doodle doodle-left" aria-hidden="true">↗</span><span className="hero-doodle doodle-right" aria-hidden="true">✧</span>
        </section>
        <ServiceExplorer />
      </div>

      <div className="connection-line container"><span>For the first idea.</span><span>For the next chapter.</span><span>For wherever you’re going.</span></div>

      <section id="services" className="section services-section container" aria-labelledby="services-title">
        <div className="section-heading"><span className="eyebrow purple">SIX AREAS OF EXPERTISE</span><h2 id="services-title">Different expertise.<br /><em>One connected vision.</em></h2><p>From your first technology decision to your next digital transformation.<br className="desktop-break" /> Start with one, or bring them together.</p></div>
        <div className="service-cards">{services.map((service, index) => { const Icon = [Compass, Workflow, Monitor, ChartNoAxesCombined, Sparkles, ShieldCheck][index]; return <article className="service-card" key={service.id}><ProjectArt service={service.id} compact /><div className="service-card-copy"><span className={`service-icon icon-${service.id}`}><Icon size={21} aria-hidden="true" /></span><h3>{service.name}</h3><p>{service.description}</p><ul>{service.outcomes.map(outcome => <li key={outcome}><Check size={14} aria-hidden="true" />{outcome}</li>)}</ul><Link className="text-link" href={`/project-discovery?service=${service.id}`}>Explore the possibilities <ArrowUpRight size={17} aria-hidden="true" /></Link></div></article>; })}</div>
      </section>

      <section id="approach" className="approach-section" aria-labelledby="approach-title"><div className="container"><div className="approach-heading"><span className="eyebrow">FROM “WHAT IF” TO “WHAT’S NEXT”</span><h2 id="approach-title">Great work starts<br />with <em>understanding.</em></h2><p>You bring the ambition. We make space for the questions,<br className="desktop-break" /> the thinking, and the details that move it forward.</p></div><ol className="process-grid"><li><span className="step-number">01</span><h3>Tell us your story.</h3><p>Share your idea, your challenge, or the thing you can’t quite put into words. We start by listening.</p><span className="process-caption">A simple project brief</span></li><li><span className="step-number">02</span><h3>Find the right direction.</h3><p>Explore what matters, connect the dots, and agree on a practical scope that fits your goals.</p><span className="process-caption">A considered conversation</span></li><li><span className="step-number">03</span><h3>Make it happen, together.</h3><p>Move from a shared plan to thoughtful work, with clear next steps and room for your feedback.</p><span className="process-caption">A collaborative way forward</span></li></ol><Link href="/project-discovery" className="button button-light">Let’s start with your idea <ArrowUpRight size={19} aria-hidden="true" /></Link></div></section>

      <section id="about" className="section about-section container" aria-labelledby="about-title"><div className="about-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-centre"><span className="brand-mark"><span /><span /></span><b>Your next<br />chapter.</b></div><div className="orbit-label orbit-strategy"><Compass size={19} /> Clear thinking</div><div className="orbit-label orbit-brand"><Layers3 size={19} /> Practical solutions</div><div className="orbit-label orbit-digital"><Monitor size={19} /> Useful technology</div><span className="orbit-spark">✳</span></div><div className="about-copy"><span className="eyebrow purple">PART OF INNOMARKS GROUP</span><h2 id="about-title">The best ideas<br />don’t live <em>in silos.</em></h2><p>Innomarks Technology Consulting is a technology and business consulting division under Innomarks Group. We help businesses improve efficiency, adopt innovative technologies, and make informed decisions.</p><p>Whether you’re starting something new or rethinking what’s already there, the approach stays the same: understand the people, simplify the challenge, and create with purpose.</p><div className="about-principles"><span><Check size={16} aria-hidden="true" /> Clear over complicated</span><span><Check size={16} aria-hidden="true" /> People before pixels</span><span><Check size={16} aria-hidden="true" /> Your context, always</span></div></div></section>

      <section id="faqs" className="section faq-section container" aria-labelledby="faq-title"><div><span className="eyebrow purple">A LITTLE MORE CLARITY</span><h2 id="faq-title">Good questions.<br /><em>Honest answers.</em></h2><p>Wondering where to start?<br />You’re in the right place.</p><Link className="text-link" href="/project-discovery">Tell us what’s on your mind <ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

      <section className="closing-cta container" aria-labelledby="closing-title"><span className="closing-spark" aria-hidden="true">✳</span><span className="eyebrow purple">YOUR NEXT CHAPTER STARTS WITH A CONVERSATION</span><h2 id="closing-title">A spark of an idea?<br /><em>Let’s give it direction.</em></h2><p>You don’t need to have it all figured out.<br />Tell us where you are. We’ll take it from there.</p><Link href="/project-discovery" className="button button-primary button-large">Let’s talk about your project <ArrowUpRight size={20} aria-hidden="true" /></Link><span className="closing-note"><Sparkles size={14} aria-hidden="true" /> A few questions. A clearer starting point.</span></section>
    </main>
    <SiteFooter />
  </>;
}
