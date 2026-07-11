import type { Metadata } from "next";
import { ProfessoresPage } from "@/components/professores-page";
import { site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Professores | ${site.name}`,
  description:
    "Conheça o time artístico-pedagógico do Mads Project: professores de canto, teatro, dança e teatro musical.",
  alternates: {
    canonical: `${site.url}/professores/`,
  },
  openGraph: {
    title: `Professores | ${site.name}`,
    description:
      "Conheça o time artístico-pedagógico do Mads Project: professores de canto, teatro, dança e teatro musical.",
    url: `${site.url}/professores/`,
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <ProfessoresPage />;
}
