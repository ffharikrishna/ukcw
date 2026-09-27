import Image from "next/image";
import type { Department } from "@/lib/departments";
import s from "./DepartmentLogo.module.css";

/** Department mark at a shared height, so wordmarks and badges line up. */
export function DepartmentLogo({ dept, height }: { dept: Department; height: number }) {
  const h = Math.round(height * (dept.logo.scale ?? 1));
  const w = Math.round((h * dept.logo.width) / dept.logo.height);

  return (
    <Image src={dept.logo.src} alt={`${dept.name} logo`} width={w} height={h} className={s.logo} />
  );
}
