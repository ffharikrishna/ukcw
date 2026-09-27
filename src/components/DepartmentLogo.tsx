import Image from "next/image";
import type { Department } from "@/lib/departments";
import s from "./DepartmentLogo.module.css";

/**
 * Department mark at a shared height, so wordmarks and badges line up.
 * Departments without an official logo get a white text mark of their name.
 */
export function DepartmentLogo({ dept, height }: { dept: Department; height: number }) {
  if (!dept.logo) {
    return (
      <span className={s.textMark} style={{ "--h": `${height}px` } as React.CSSProperties} role="img" aria-label={dept.name}>
        {dept.name}
      </span>
    );
  }

  const h = Math.round(height * (dept.logo.scale ?? 1));
  const w = Math.round((h * dept.logo.width) / dept.logo.height);

  return (
    <Image src={dept.logo.src} alt={`${dept.name} logo`} width={w} height={h} className={s.logo} />
  );
}
