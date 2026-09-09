"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Mail, Workflow } from "lucide-react";
const links = [{ href: "/admin/preview", name: "Project inquiries", icon: Inbox }, { href: "/admin/preview/email-templates", name: "Email templates", icon: Mail }, { href: "/admin/preview/automations", name: "Automation", icon: Workflow }];
export function PreviewNavigation({ live = false }: { live?: boolean }) {
  const path = usePathname();
  return <nav aria-label={live ? "Staff navigation" : "Preview navigation"}>{links.map(({ href, name, icon: Icon }) => {
    const destination = live ? href.replace("/admin/preview", "/admin/leads") : href;
    const selected = href === "/admin/preview" ? !path.includes("email-templates") && !path.includes("automations") : path === destination;
    return <Link key={href} href={destination} aria-current={selected ? "page" : undefined}><Icon size={17} aria-hidden="true" />{live && name === "Email templates" ? "Email responses" : name}</Link>;
  })}</nav>;
}
