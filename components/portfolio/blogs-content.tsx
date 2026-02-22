import Link from "next/link";

import { blogs } from "@/components/portfolio/data";

const externalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export function BlogsContent() {
  return (
    <main className="page">
      <section id="top" className="panel projects-panel">
        <div className="panel-head">
          <p className="label">all blogs</p>
          <Link className="panel-link" href="/#blogs">
            back to portfolio ↗
          </Link>
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
    </main>
  );
}
