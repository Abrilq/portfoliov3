import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/project-artwork";
import { PortfolioStyleProvider } from "@/components/portfolio-style-switcher";
import { getPortfolioContent } from "@/lib/data";

export const revalidate = 300;

export default async function WorkArchivePage() {
  const { projects } = await getPortfolioContent();

  return (
    <PortfolioStyleProvider>
    <main>
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="John Clarence Legaspi, home">CL<span>.</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#experience">Experience</Link></nav>
          <Link className="header-contact" href="/#contact">Let&apos;s talk <ArrowUpRight size={16} /></Link>
        </header>
        <section className="archive-page">
          <Link className="back-link" href="/#work"><ArrowLeft size={15} /> Back to home</Link>
          <div className="section-heading archive-heading"><div><p className="eyebrow">Selected work / 2024—25</p><h1>Project<br /><em>archive.</em></h1></div><p className="section-aside">A collection of interfaces, systems, and experiments. {projects.length} projects.</p></div>
          <div className="project-grid">
            {projects.map((project, index) => <Link className="project-card" href={`/work/${project.slug}`} key={project.id}><ProjectArtwork project={project} index={index} /><div className="project-meta"><span>{project.category} <i>/</i> {project.year}</span><ArrowUpRight size={19} /></div><h2>{project.title}</h2><p>{project.summary}</p><div className="project-tags">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div></Link>)}
          </div>
        </section>
      </div>
    </main>
    </PortfolioStyleProvider>
  );
}