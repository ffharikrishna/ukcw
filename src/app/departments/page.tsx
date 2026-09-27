import type { Metadata } from "next";
import Link from "next/link";
import { Departments } from "@/components/Departments";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";
import s from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Departments",
  description: "The departments that make up UK Canary Wharf Roleplay, from the Met to the RNLI.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader eyebrow="Departments" title={`${site.departmentCount} departments, one city`}>
        Every department has its own command structure, training and SOPs. Most people start in one and pick up a
        second once they know the ropes.
      </PageHeader>

      <section className="section">
        <div className="container">
          <Departments variant="list" />
        </div>
      </section>

      <section className={s.next}>
        <div className={`container ${s.nextInner}`}>
          <div>
            <h2>Found the one for you?</h2>
            <p>Applications and training are run through the Discord.</p>
          </div>
          <div className={s.nextActions}>
            <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
              Join the Discord <span className="arrow">→</span>
            </a>
            <Link href="/info" className="btn btn-ghost">
              Info
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
