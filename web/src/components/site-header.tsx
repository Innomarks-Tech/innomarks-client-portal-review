"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./brand";

const links = [
  ["Services", "/#services"],
  ["Contact us", "/contact"],
  ["About", "/#about"],
  ["FAQ", "/#faqs"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); trigger.current?.focus(); }
    }}>
      <div className="nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link href="/project-discovery" className="button button-primary nav-cta">Tell us about your project <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <button ref={trigger} className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/project-discovery" onClick={() => setOpen(false)}>Tell us about your project <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
