import {
  blogs,
  experience,
  footerLinks,
  githubProfileUrl,
  githubUser,
  profileLinks,
  projects,
  resumeUrl,
  skillGroups,
} from "@/components/portfolio/data";
import { GithubGraphImage } from "@/components/portfolio/github-graph-image";
import { SillyStatsPanel } from "@/components/portfolio/silly-stats-panel";

const externalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export function HomeContent() {
  return (
    <main className="page">
      <section
        id="top"
        className="hero profile-hero profile-hero-ascii"
        data-reveal
      >
        <div className="profile-hero-grid">
          <div className="profile-hero-copy">
            <p className="hero-kicker">
              <span>portfolio</span>
              <span>/</span>
              <span>2026</span>
            </p>
            <h1 className="hero-name">
              <span>Aditya Mandal</span>
            </h1>
            <p className="hero-about">
              <span>Backend and Solana smart contract engineer.</span>
            </p>
            <p className="hero-subline">cs @ sppu · i learn and build stuff.</p>

            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Available for opportunities</span>
              <span className="status-pill">Remote</span>
            </div>

            <div className="hero-links-plain">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? externalProps : {})}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="profile-ascii" aria-hidden="true" />
        </div>
      </section>

      <section id="projects" className="panel projects-panel" data-reveal>
        <div className="panel-head projects-head">
          <p className="label">my projects</p>
          <a className="panel-link projects-cta" href={githubProfileUrl} {...externalProps}>
            view more projects ↗
          </a>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <div className="project-top">
                <a
                  href={project.href}
                  className="project-title"
                  {...externalProps}
                >
                  {project.title} <span>↗</span>
                </a>
                <p className="project-date">{project.date}</p>
              </div>

              <div className="project-stack">
                {project.stack.map((tag) => (
                  <span key={`${project.title}-${tag}`} className="stack-chip">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="project-summary">{project.summary}</p>

              <ul className="project-points">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="blogs" className="panel projects-panel" data-reveal>
        <div className="panel-head projects-head">
          <p className="label">blogs</p>
          <a className="panel-link projects-cta" href="/blogs">
            see more ↗
          </a>
        </div>

        <p className="blogs-note">
          i sometimes writes about what i learned (more coming soon).
        </p>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <article key={blog.href} className="project-card">
              <div className="project-top">
                <a href={blog.href} className="project-title" {...externalProps}>
                  {blog.title} <span>↗</span>
                </a>
                <p className="project-date">{blog.source}</p>
              </div>

              <p className="entry-role">{blog.role}</p>

              <div className="project-stack">
                {blog.stack.map((tag) => (
                  <span key={`${blog.title}-${tag}`} className="stack-chip">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="project-summary">{blog.summary}</p>

              <ul className="project-points">
                {blog.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="panel" data-reveal>
        <div className="panel-head">
          <p className="label">experience</p>
          <a className="panel-link resume-cta" href={resumeUrl} {...externalProps}>
            view resume ↗
          </a>
        </div>

        <div className="stack">
          {experience.map((entry) => (
            <article key={entry.title} className="entry">
              <div className="entry-top">
                <h3 className="entry-title">{entry.title}</h3>
              </div>
              <p className="entry-org">{entry.org}</p>
              <p className="entry-role">{entry.role}</p>
              <ul className="entry-bullets">
                {entry.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="panel" data-reveal>
        <div className="panel-head">
          <p className="label">skills</p>
        </div>

        <div className="skill-columns">
          {skillGroups.map((group) => (
            <article key={group.title} className="skill-group">
              <h3>{group.title}</h3>
              <div className="chip-cloud">
                {group.chips.map((chip) => (
                  <span key={`${group.title}-${chip}`} className="chip">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <SillyStatsPanel />

      <section id="github-graph" className="panel github-panel" data-reveal>
        <div className="panel-head">
          <p className="label">github commit graph</p>
          <a
            className="panel-link projects-cta"
            href={githubProfileUrl}
            {...externalProps}
          >
            open github ↗
          </a>
        </div>

        <div className="graph-frame">
          <GithubGraphImage user={githubUser} />
        </div>
      </section>

      <footer id="contact" className="site-footer footer-pro" data-reveal>
        <div className="footer-pro-left">
          <p className="footer-kicker">contact</p>
          <p className="footer-title">
            Open to internships, freelance work, and collaborations.
          </p>
          <p className="footer-meta">© 2026 Aditya Mandal.</p>
        </div>

        <div className="footer-actions">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? externalProps : {})}
            >
              {link.label}
              {link.label === "discord" ? " ↗" : ""}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
