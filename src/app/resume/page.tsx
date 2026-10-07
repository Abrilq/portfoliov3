import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ResumePrintButton } from "@/components/resume-print-button";
import { PortfolioStyleProvider } from "@/components/portfolio-style-switcher";
import { personalProjects } from "@/lib/content";
import { getPortfolioContent } from "@/lib/data";
import { formatExperienceDates } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resume | John Clarence Legaspi",
  description: "Resume of John Clarence A. Legaspi, frontend developer and IT graduate.",
};

export default async function ResumePage() {
  const { profile, experiences, projects, certifications } = await getPortfolioContent();
  const allProjects = [...projects, ...personalProjects];

  return (
    <PortfolioStyleProvider>
      <main className="resume-document">
        <div className="site-shell">
          <header className="site-header resume-site-header">
            <Link className="wordmark" href="/" aria-label="John Clarence Legaspi, home">CL<span>.</span></Link>
            <nav className="desktop-nav" aria-label="Main navigation">
              <Link href="/#work">Work</Link>
              <Link href="/#about">About</Link>
              <Link href="/#experience">Experience</Link>
              <Link href="/#resume" aria-current="page">Resume</Link>
            </nav>
            <Link className="header-contact" href="/#resume"><ArrowLeft size={15} /> Back to portfolio</Link>
          </header>

          <article className="resume-page">
            <div className="resume-page-top">
              <div>
                <p className="eyebrow">Curriculum vitae</p>
                <h1>{profile.name}</h1>
                <p className="resume-role">{profile.role}</p>
              </div>
              <div className="resume-contact">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                {profile.phone && <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>}
                <span>{profile.location}</span>
                {profile.website && <a href={profile.website} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, "")} <ArrowUpRight size={13} /></a>}
              </div>
            </div>

            <section className="resume-block">
              <h2>Profile</h2>
              <p>{profile.summary}</p>
            </section>

            <section className="resume-block">
              <h2>Experience</h2>
              <div className="resume-entry-list">
                {experiences.map((experience) => (
                  <article className="resume-entry" key={experience.id}>
                    <div className="resume-entry-heading">
                      <div><h3>{experience.title}</h3><p>{experience.company} / {experience.location}</p></div>
                      <span>{formatExperienceDates(experience.start_date, experience.end_date)}</span>
                    </div>
                    <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="resume-block">
              <h2>Projects</h2>
              <div className="resume-entry-list resume-project-list">
                {allProjects.map((project) => (
                  <article className="resume-entry" key={project.id}>
                    <div className="resume-entry-heading">
                      <div><h3>{project.title}</h3><p>{project.category}{project.year && ` / ${project.year}`} / {project.role}</p></div>
                      {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">View project <ArrowUpRight size={13} /></a>}
                    </div>
                    <p>{project.summary}</p>
                    <p className="resume-project-stack">{project.stack.join(" · ")}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="resume-block resume-education-skills">
              <div>
                <h2>Education</h2>
                <article className="resume-entry">
                  <h3>{profile.education_degree}</h3>
                  <p>{profile.education_school}</p>
                  <p>{profile.education_start} — {profile.education_end}</p>
                </article>
              </div>
              <div>
                <h2>Skills</h2>
                <p>{profile.skills.join(" · ")}</p>
              </div>
            </section>

            <section className="resume-block">
              <h2>Certifications</h2>
              <ul className="resume-certifications">
                {certifications.map((certification) => (
                  <li key={certification.id}><span>{certification.title}</span><span>{certification.issuer} / {certification.year}</span></li>
                ))}
              </ul>
            </section>

            <div className="resume-download-actions">
              <ResumePrintButton />
            </div>
          </article>
        </div>
      </main>
    </PortfolioStyleProvider>
  );
}
