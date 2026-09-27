import s from "./PageHeader.module.css";

export function PageHeader({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className={s.header}>
      <div className={s.glow} aria-hidden />
      <div className={`container ${s.grid}`} data-has-aside={Boolean(aside)}>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className={s.title}>{title}</h1>
          {children && <div className={s.lede}>{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
