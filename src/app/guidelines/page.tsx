import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Guidelines",
  description: "UKCW server guidelines.",
};

// Placeholder until the guidelines are written.
export default function GuidelinesPage() {
  return (
    <PageHeader eyebrow="Guidelines" title="Guidelines">
      The server guidelines are being written and will be published here soon.
    </PageHeader>
  );
}
