import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "projects", href: "/#projects" },
  { label: "experience", href: "/#experience" },
  { label: "skills", href: "/#skills" },
  { label: "blogs", href: "/blogs" },
  { label: "contact", href: "/#contact" },
];

export function SiteHeader() {
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link className="nav-brand" href="/#top">
          <Image
            src="/nav-logo.png"
            alt=""
            width={30}
            height={30}
            className="nav-logo"
            aria-hidden
          />
          <span>aditya mandal</span>
        </Link>

        <nav aria-label="main navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
