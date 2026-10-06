import { AddAnother, CertificationForm, DeleteItem } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminCertificationsPage() {
  const { certifications } = await getAdminPortfolio();
  return (
    <div className="admin-page">
      <div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / certifications</p><h1>Certifications</h1></div><p>Keep credentials current and ordered the way you want them displayed.</p></div>
      <div className="admin-item-list">{certifications.map((certification) => <details className="admin-item" key={certification.id}><summary><span><strong>{certification.title}</strong><small>{certification.issuer} / {certification.year}</small></span><span className={`publish-state ${certification.published ? "is-published" : ""}`}>{certification.published ? "Published" : "Draft"}</span></summary><CertificationForm certification={certification} /><DeleteItem table="certifications" id={certification.id} title={certification.title} /></details>)}</div>
      <section className="admin-panel add-panel"><AddAnother label="Add certification" /><CertificationForm /></section>
    </div>
  );
}