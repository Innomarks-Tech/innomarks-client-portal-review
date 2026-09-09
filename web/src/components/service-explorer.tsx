"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { services } from "@/lib/services";
import styles from "@/app/landing.module.css";

const examples = {
  consulting: { challenge: "We need a clear technology direction.", before: "Competing priorities. Too many tools. No shared plan.", after: "A practical roadmap, with decisions linked to business goals.", output: "Technology roadmap" },
  transformation: { challenge: "Our ways of working need to catch up.", before: "Paper forms, disconnected systems and repeated handovers.", after: "Connected digital processes that help people work together.", output: "Connected workflow" },
  software: { challenge: "We need software that fits our business.", before: "A booking process managed across emails and spreadsheets.", after: "One application for availability, bookings and progress.", output: "Custom application" },
  data: { challenge: "We have data, but need clearer answers.", before: "Reports spread across files, with no consistent view.", after: "A dashboard that brings key information into one place.", output: "Business dashboard" },
  automation: { challenge: "Repetitive work is taking too much time.", before: "People copying information and chasing routine updates.", after: "An automated workflow, with people reviewing exceptions.", output: "Automated workflow" },
  security: { challenge: "We need more confidence in our technology.", before: "Unclear responsibilities and gaps in risk awareness.", after: "Clearer governance, practical guidance and risk priorities.", output: "Risk and governance plan" },
} as const;

export function ServiceExplorer() {
  const section = useRef<HTMLElement>(null);
  const guide = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stickyReady, setStickyReady] = useState(false);
  const activeIndex = useRef(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReady = () => {
      if (!guide.current) return;
      setStickyReady(!preference.matches && guide.current.getBoundingClientRect().height <= window.innerHeight - 32);
    };
    updateReady();
    window.addEventListener("resize", updateReady);
    preference.addEventListener("change", updateReady);

    const syncIndexToScrollPosition = () => {
      if (!stickyReady || !section.current || !guide.current) return;
      const sectionTop = window.scrollY + section.current.getBoundingClientRect().top;
      const travel = Math.max(1, section.current.offsetHeight - guide.current.offsetHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / travel));
      const index = Math.round(progress * (services.length - 1));
      if (index !== activeIndex.current) {
        activeIndex.current = index;
        setActive(index);
      }
    };
    window.addEventListener("scroll", syncIndexToScrollPosition, { passive: true });

    return () => { window.removeEventListener("scroll", syncIndexToScrollPosition); window.removeEventListener("resize", updateReady); preference.removeEventListener("change", updateReady); };
  }, [stickyReady]);
  const select = (index: number) => {
    activeIndex.current = index;
    setActive(index);
    if (!stickyReady || !section.current || !guide.current) return;
    const sectionTop = window.scrollY + section.current.getBoundingClientRect().top;
    const travel = Math.max(0, section.current.offsetHeight - guide.current.offsetHeight);
    window.scrollTo({ top: sectionTop + (travel * index) / Math.max(1, services.length - 1), behavior: "smooth" });
  };
  return <section ref={section} id="services" className={[styles.services, stickyReady && styles.stickyServices].filter(Boolean).join(" ")} aria-labelledby="services-title">
    <div className={`container ${styles.serviceStage}`}>
      <div className={styles.sectionIntro} data-motion="left">
        <div><span className="eyebrow purple">Our services</span><h2 id="services-title">Start with what<br />you want to <em>change.</em></h2></div>
        <p>Six areas of expertise. Your challenge is the starting point.<br />Explore as you scroll, or open any service to take a closer look.</p>
      </div>
      <div ref={guide} className={styles.serviceGuide}>
      <nav className={styles.serviceNav} aria-label="Choose a service">{services.map((service, index) => <button key={service.id} type="button" aria-current={active === index ? "step" : undefined} aria-controls={`service-${service.id}`} onClick={() => select(index)}><span>0{index + 1}</span>{service.name}<ArrowUpRight size={16} aria-hidden="true" /></button>)}</nav>
      <div className={styles.servicePanels}>
        {services.map((service, index) => {
          const example = examples[service.id];
          return <article id={`service-${service.id}`} className={styles.servicePanel} hidden={active !== index} key={service.id} aria-label={service.name}>
            <div className={styles.activeServiceTitle}><span className="eyebrow purple">0{index + 1} / 06 · {service.shortName}</span><p>{example.challenge}</p></div>
            <div className={styles.serviceBody}>
              <div className={styles.serviceCopy}>
                <h3>{service.title}</h3><p>{service.description}</p>
                <ul>{service.outcomes.map((outcome) => <li key={outcome}><Check size={16} aria-hidden="true" />{outcome}</li>)}</ul>
                <Link className="text-link" href={`/project-discovery?service=${service.id}`}>Discuss {service.shortName.toLowerCase()} <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
              <div className={styles.example}>
                <span className="eyebrow">What this could look like</span>
                <div className={styles.before}><span>The challenge</span><p>{example.before}</p></div>
                <ArrowDown className={styles.exampleArrow} size={21} aria-hidden="true" />
                <div className={styles.after}><span>{example.output}</span><p>{example.after}</p></div>
                <small>An illustrative example, shaped to your business.</small>
              </div>
            </div>
          </article>;
        })}
      </div>
      </div>
    </div>
  </section>;
}
