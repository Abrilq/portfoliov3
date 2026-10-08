"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BriefcaseBusiness, FileText, FolderKanban, LayoutDashboard, LogOut } from "lucide-react";
import { signOutAdmin } from "./actions";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/resume-details", label: "Resume details", icon: FileText },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
];

export function AdminFrame({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin"><span>CL</span> CONTENT STUDIO</Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          {adminLinks.map(({ href, label, icon: Icon }) => <Link aria-current={pathname === href ? "page" : undefined} href={href} key={href}><Icon size={17} /><span>{label}</span></Link>)}
        </nav>
        <div className="admin-sidebar-bottom"><span>PORTFOLIO OWNER</span><form action={signOutAdmin}><button type="submit"><LogOut size={15} /> Sign out</button></form></div>
      </aside>
      <main className="admin-main"><div className="admin-topline"><Link href="/" target="_blank">View public portfolio <span>↗</span></Link><span>CONTENT STUDIO / ADMIN</span></div>{children}</main>
    </div>
  );
}