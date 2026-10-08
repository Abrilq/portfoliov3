import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { ProjectArtwork } from "@/components/project-artwork";
import { PortfolioStylePicker, PortfolioStyleProvider } from "@/components/portfolio-style-switcher";
import { personalProjects } from "@/lib/content";
import { getPortfolioContent } from "@/lib/data";
import { formatExperienceDates } from "@/lib/format";
import { ToolLogo } from "@/lib/tool-icons";

export const revalidate = 300;

export default async function Home() {
  const { profile, experiences, projects, certifications } = await getPortfolioContent();
  const featuredProjects = projects
    .filter((project) => project.featured && project.slug !== "ordering-system")
    .slice(0, 4);

  return (
    <PortfolioStyleProvider>
    <main>
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="#top" aria-label="John Clarence Legaspi, home">CL<span>.</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#work">Work <span>{String(projects.length).padStart(2, "0")}</span></a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#resume">Resume</a>
          </nav>
          <a className="header-contact" href={`mailto:${profile.email}`}>Let&apos;s talk <ArrowUpRight size={16} /></a>
        </header>

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> Portfolio / 2026</p>
            <h1>Thoughtful<br />interfaces.<br /><em>Useful</em> by design.</h1>
            <div className="hero-bottom">
              <div className="hero-intro">
                <p className="hero-summary">{profile.summary}</p>
                {profile.availability && <p className="availability-note"><span />{profile.availability}</p>}
              </div>
              <a className="round-link" href="#work" aria-label="Explore selected work"><ArrowDownRight size={20} /></a>
            </div>
          </div>
          <aside className="hero-aside" aria-label="A glimpse of my work">
            <div className="hero-stamp"><span>BUILT WITH</span><b>care<br />& clarity</b><i>CL / PH</i></div>
            <div className="workflow-preview">
              <div className="workflow-top"><span>SRF / SERVICE REQUEST</span><span className="workflow-status">IN REVIEW</span></div>
              <p className="workflow-id">REQUEST <strong>#SR-0241</strong></p>
              <h2>Replace office<br />workstation</h2>
              <div className="workflow-steps"><span className="is-done">Submitted</span><span className="is-current">Department</span><span>IT review</span></div>
              <div className="workflow-footer"><span>APPROVAL FLOW</span><b>02 / 04</b></div>
            </div>
            <p className="aside-caption"><span>01 — 02</span> Interface design meets real-world workflows.</p>
          </aside>
          <div className="hero-index">01 <i /> 04</div>
        </section>

        <PortfolioStylePicker />

        <aside className="parallax-promo">
          <div>
            <p className="eyebrow">A different perspective</p>
            <a href="https://clarence-port.vercel.app/" target="_blank" rel="noreferrer">
              You can visit my parallax portfolio too! <ArrowUpRight size={18} />
            </a>
          </div>
          <p>It may take a little longer to load—thanks for your patience.</p>
        </aside>

        <section className="work-section section-rule" id="work">
          <div className="section-heading">
            <div><p className="eyebrow">Selected work / 2024—25</p><h2>Made to make<br /><em>things clearer.</em></h2></div>
            <p className="section-aside">A few projects where product thinking, visual design, and implementation meet.</p>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project, index) => (
              <Link className="project-card" href={`/work/${project.slug}`} key={project.id}>
                <ProjectArtwork project={project} index={index} />
                <div className="project-meta"><span>{project.category}{project.year && <> <i>/</i> {project.year}</>}</span><ArrowUpRight size={19} /></div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="project-tags">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
              </Link>
            ))}
          </div>
          <div className="project-footnote"><Link href="/work">Explore all {projects.length} projects <ArrowRight size={14} /></Link><span>01 — {String(projects.length).padStart(2, "0")}</span></div>
        </section>

        <section className="personal-projects-section section-rule">
          <div className="section-heading">
            <div><p className="eyebrow">Made on my own time</p><h2>Personal<br /><em>projects.</em></h2></div>
            <p className="section-aside">Small tools and experiments built independently.</p>
          </div>
          <div className="project-grid">
            {personalProjects.map((project, index) => (
              <Link className="project-card" href={`/work/${project.slug}`} key={project.id}>
                <ProjectArtwork project={project} index={featuredProjects.length + index} />
                <div className="project-meta"><span>{project.category}</span><ArrowUpRight size={19} /></div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="project-tags">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="about-section section-rule" id="about">
          <div className="section-label"><p className="eyebrow">A little about me</p><span>02 / 04</span></div>
          <div className="about-grid">
            <h2>Technology should feel <em>human.</em></h2>
            <div className="about-copy"><p>I bring a mix of frontend craft, systems thinking, and a steady curiosity about how people use the things we build.</p><a href={`mailto:${profile.email}`}>Start a conversation <ArrowRight size={16} /></a></div>
          </div>
          <div className="skills-band">
            <span>TOOLS & TECHNOLOGIES</span>
            <div className="skills-marquee" aria-label="Tools and technologies">
              <div className="skills-marquee-track">
                {[false, true].map((isDuplicate) => (
                  <ul
                    className="skills-marquee-list"
                    aria-hidden={isDuplicate || undefined}
                    aria-label={isDuplicate ? undefined : "Tools and technologies"}
                    key={String(isDuplicate)}
                  >
                    {profile.skills.map((skill) => (
                      <li className="skills-marquee-item" key={skill}>
                        <ToolLogo name={skill} />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="experience-section section-rule" id="experience">
          <div className="section-heading compact-heading"><div><p className="eyebrow">Work, learning, practice</p><h2>Where I&apos;ve <em>been.</em></h2></div><p className="section-aside">Hands-on experience across e-commerce and internal systems.</p></div>
          <div className="experience-list">
            {experiences.map((experience) => (
              <article className="experience-item" key={experience.id}>
                <div className="experience-dates">{formatExperienceDates(experience.start_date, experience.end_date)}</div>
                <div><h3>{experience.title}</h3><p className="experience-company">{experience.company} <span>/</span> {experience.location}</p></div>
                <ul>{experience.highlights.slice(0, 3).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="education-row"><span>EDUCATION</span><p><strong>{profile.education_school}</strong><br />{profile.education_degree}</p><b>{profile.education_start} — {profile.education_end}</b></div>
        </section>

        <section className="credentials-section section-rule">
          <div className="section-label"><p className="eyebrow">Learning in practice</p><span>03 / 04</span></div>
          <div className="credentials-grid"><h2>Always<br /><em>building.</em></h2><div className="credential-list">{certifications.map((certification) => <div className="credential-item" key={certification.id}><span>{certification.year}</span><p><strong>{certification.title}</strong><small>{certification.issuer}</small></p><ArrowUpRight size={16} /></div>)}</div></div>
        </section>

        <section className="resume-section section-rule" id="resume">
          <div className="section-label"><p className="eyebrow">Experience, skills, and education</p><span>04 / 04</span></div>
          <div className="resume-promo">
            <div><p className="eyebrow">Resume</p><h2>A closer look at<br /><em>my experience.</em></h2></div>
            <p>Explore my complete background, skills, education, projects, and certifications in one place.</p>
            <Link className="resume-button" href="/resume">View full resume <ArrowUpRight size={17} /></Link>
          </div>
        </section>

      </div>
      <footer className="site-footer" id="contact">
        <div className="site-shell">
          <p className="eyebrow">Have a good one in mind?</p><div className="footer-main"><h2>Let&apos;s make<br /><em>it useful.</em></h2><a href={`mailto:${profile.email}`} aria-label="Email John Clarence"><Mail size={22} /><span>{profile.email}</span><ArrowUpRight size={17} /></a></div>
          <div className="footer-bottom"><Link className="wordmark" href="#top">CL<span>.</span></Link><span>{profile.location}</span>{profile.phone && <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>}{profile.website && <a href={profile.website} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, "")}</a>}<span>Designed & built by John Clarence / 2026</span><a href="#top"><ArrowUp size={14} /> Back to top</a></div>
        </div>
      </footer>
    </main>
    </PortfolioStyleProvider>
  );
}
