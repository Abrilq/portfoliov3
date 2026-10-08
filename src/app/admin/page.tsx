import Link from "next/link";
import { ArrowUpRight, Award, BriefcaseBusiness, FileText, FolderKanban } from "lucide-react";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminDashboard() {
  const content = await getAdminPortfolio();
  const items = [
    { href: "/admin/resume-details", label: "Resume details", count: "01", detail: "Personal details, headline, and education", icon: FileText },
    { href: "/admin/experience", label: "Experience", count: String(content.experiences.length).padStart(2, "0"), detail: "Roles, highlights, and visibility", icon: BriefcaseBusiness },
    { href: "/admin/projects", label: "Projects", count: String(content.projects.length).padStart(2, "0"), detail: "Case studies and rich-text project pages", icon: FolderKanban },
    { href: "/admin/certifications", label: "Certifications", count: String(content.certifications.length).padStart(2, "0"), detail: "Credentials shown on the portfolio", icon: Award },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-heading"><div><p className="eyebrow">Your portfolio / content</p><h1>Good morning.<br /><em>What are we updating?</em></h1></div><p>Edits publish to the site after save. Cached public pages refresh automatically.</p></div>
      <div className="admin-summary"><span>CONTENT AREAS</span><strong>04</strong><span>EDITABLE COLLECTIONS</span></div>
      <div className="admin-collection-grid">{items.map(({ href, label, count, detail, icon: Icon }) => <Link className="admin-collection-link" href={href} key={href}><span className="admin-collection-icon"><Icon size={18} /></span><span className="admin-collection-copy"><small>{count} / COLLECTION</small><strong>{label}</strong><span>{detail}</span></span><ArrowUpRight size={18} /></Link>)}</div>
    </div>
  );
}