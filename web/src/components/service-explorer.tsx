"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Compass, Workflow, Monitor, ChartNoAxesCombined, Sparkles, ShieldCheck } from "lucide-react";
import { services } from "@/lib/services";
import { ProjectArt } from "./project-art";

const icons = [Compass, Workflow, Monitor, ChartNoAxesCombined, Sparkles, ShieldCheck];

export function ServiceExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % services.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + services.length) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }

  return (
    <section className="service-explorer container" aria-label="Explore our services">
      <div className="service-tabs" role="tablist" aria-label="Choose a service">
        {services.map((service, index) => { const Icon = icons[index]; return <button key={service.id} id={`service-tab-${service.id}`} ref={(node) => { tabs.current[index] = node; }} role="tab" aria-selected={selected === index} aria-controls={`service-panel-${service.id}`} tabIndex={selected === index ? 0 : -1} className={`service-tab${selected === index ? " selected" : ""}`} onClick={() => setSelected(index)} onKeyDown={(event) => onKeyDown(event, index)}><Icon size={18} aria-hidden="true" /><span>{service.name}</span></button>; })}
      </div>
      <div className="explorer-window">
        <div className="explorer-toolbar"><span><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /></span><span>A glimpse of what we can create together</span><span className="sample-label">Illustrative concept</span></div>
        {services.map((service, index) => <div role="tabpanel" id={`service-panel-${service.id}`} aria-labelledby={`service-tab-${service.id}`} hidden={selected !== index} tabIndex={0} key={service.id} className="explorer-panel"><div className="explorer-copy"><span className="eyebrow purple">{service.eyebrow}</span><h2>{service.title}</h2><p>{service.description}</p><Link href={`/project-discovery?service=${service.id}`} className="text-link">Let’s explore {service.shortName.toLowerCase()} <ArrowUpRight size={17} aria-hidden="true" /></Link></div><ProjectArt service={service.id} /></div>)}
      </div>
    </section>
  );
}
