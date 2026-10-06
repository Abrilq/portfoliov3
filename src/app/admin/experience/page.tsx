import { AddAnother, DeleteItem, ExperienceForm } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminExperiencePage() {
  const { experiences } = await getAdminPortfolio();
  return (
    <div className="admin-page">
      <div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / experience</p><h1>Work history</h1></div><p>Control role descriptions, ordering, and what appears publicly.</p></div>
      <div className="admin-item-list">{experiences.map((experience) => <details className="admin-item" key={experience.id}><summary><span><strong>{experience.title}</strong><small>{experience.company}</small></span><span className={`publish-state ${experience.published ? "is-published" : ""}`}>{experience.published ? "Published" : "Draft"}</span></summary><ExperienceForm experience={experience} /><DeleteItem table="experiences" id={experience.id} title={experience.title} /></details>)}</div>
      <section className="admin-panel add-panel"><AddAnother label="Add experience" /><ExperienceForm /></section>
    </div>
  );
}