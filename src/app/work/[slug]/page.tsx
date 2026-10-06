import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/project-artwork";
import { fallbackProjects } from "@/lib/content";
import { getPortfolioContent, getPortfolioProject } from "@/lib/data";

export const revalidate = 300;

export async function generateStaticParams() {
  const content = await getPortfolioContent();
  return content.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  return project
    ? { title: `${project.title} | John Clarence Legaspi`, description: project.summary }
    : { title: "Project not found | John Clarence Legaspi" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, content] = await Promise.all([getPortfolioProject(slug), getPortfolioContent()]);
  if (!project) notFound();
  const artworkIndex = Math.max(0, fallbackProjects.findIndex((item) => item.slug === project.slug));

  return (
    <main>
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="John Clarence Legaspi, home">CL<span>.</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#experience">Experience</Link></nav>
          <a className="header-contact" href={`mailto:${content.profile.email}`}>Let&apos;s talk <ArrowUpRight size={16} /></a>
        </header>
        <article className="project-detail">
          <Link className="back-link" href="/#work"><ArrowLeft size={15} /> Back to selected work</Link>
          <div className="detail-heading"><div><p className="eyebrow">{project.category} / {project.year}</p><h1>{project.title}</h1></div><p>{project.summary}<br /><br /><strong>{project.role}</strong></p></div>
          <div className="detail-art"><ProjectArtwork project={project} index={artworkIndex} /></div>
          <div className="detail-body" dangerouslySetInnerHTML={{ __html: project.body_html }} />
          <div className="detail-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          {(project.live_url || project.repo_url) && <div className="detail-links">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={15} /></a>}{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">View source <ArrowUpRight size={15} /></a>}</div>}
        </article>
      </div>
    </main>
  );
}