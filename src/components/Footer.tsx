import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Waves } from "./Waves";
import s from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={s.footer}>
      <Waves className={s.waves} />
      <div className={`container ${s.grid}`}>
        <Link href="/" className={s.brand}>
          <Image src="/brand/logo.png" alt="" width={40} height={40} />
          <div>
            <strong>{site.name}</strong>
            <span>Emergency Response: Liberty County</span>
          </div>
        </Link>

        <nav className={s.nav} aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={site.discordInvite} target="_blank" rel="noreferrer">
            Discord
          </a>
        </nav>
      </div>

      <div className="container">
        <div className={s.legal}>
          <p>
            {site.shortName} is a fan-run roleplay community. We are not affiliated with or endorsed by any emergency
            service, the RNLI, National Highways, Police Roleplay Community or Roblox Corporation. Service names and
            logos belong to their respective owners.
          </p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
