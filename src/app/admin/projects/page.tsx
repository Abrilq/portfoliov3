import { AddAnother, DeleteItem, ProjectForm } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminProjectsPage() {
  const { projects, personalProjects } = await getAdminPortfolio();
  const projectGroups = [
    { title: "Case studies", items: projects },
    { title: "Personal projects", items: personalProjects },
  ];
  return (
    <div className="admin-page">
      <div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / projects</p><h1>Project library</h1></div><p>Write case studies, add links, and choose what leads on the homepage.</p></div>
      {projectGroups.map(({ title, items }) => (
        <section className="admin-project-group" key={title}>
          <h2>{title} <span>{String(items.length).padStart(2, "0")}</span></h2>
          <div className="admin-item-list">{items.map((project) => <details className="admin-item" key={project.id}><summary><span><strong>{project.title}</strong><small>{project.category}{project.year && ` / ${project.year}`}</small></span><span className={`publish-state ${project.published ? "is-published" : ""}`}>{project.published ? "Published" : "Draft"}</span></summary><ProjectForm project={project} />{/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(project.id) && <DeleteItem table="projects" id={project.id} title={project.title} />}</details>)}</div>
        </section>
      ))}
      <section className="admin-panel add-panel"><AddAnother label="Add project" /><ProjectForm /></section>
    </div>
  );
}