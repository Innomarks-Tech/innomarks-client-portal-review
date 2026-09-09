import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "@/app/landing.module.css";

const steps = [
  { title: "Share your challenge", copy: "Choose the services you need and tell us what you want to achieve. It’s okay if your budget or timeframe is still taking shape." },
  { title: "Review and send", copy: "See your answers together in one project brief. Make any changes, then send it when you’re ready." },
  { title: "Talk through the next step", copy: "The team reviews your brief and follows up using your contact details to clarify the scope and explore the fit." },
];

export function ProjectBriefJourney() {
  return <section id="process" className={styles.process} aria-labelledby="process-title"><div className="container">
    <span className="eyebrow">How we work</span><h2 id="process-title" data-motion="left">A little context.<br /><em>A better first conversation.</em></h2>
    <ol>{steps.map((step, index) => <li key={step.title} data-motion="up" data-delay={index * 120}><span className={styles.step}>0{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
    <Link href="/project-discovery" className="button button-light">Start project discovery <ArrowUpRight size={18} aria-hidden="true" /></Link>
  </div></section>;
}
