import { AddAnother, DeleteItem, ProjectForm } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminPortfolio();
  return (
    <div className="admin-page">
      <div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / projects</p><h1>Project library</h1></div><p>Write case studies, add links, and choose what leads on the homepage.</p></div>
      <div className="admin-item-list">{projects.map((project) => <details className="admin-item" key={project.id}><summary><span><strong>{project.title}</strong><small>{project.category} / {project.year}</small></span><span className={`publish-state ${project.published ? "is-published" : ""}`}>{project.published ? "Published" : "Draft"}</span></summary><ProjectForm project={project} /><DeleteItem table="projects" id={project.id} title={project.title} /></details>)}</div>
      <section className="admin-panel add-panel"><AddAnother label="Add project" /><ProjectForm /></section>
    </div>
  );
}