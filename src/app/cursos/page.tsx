import type { Metadata } from "next";
import { CursosPage } from "@/components/cursos-page";
import { site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Cursos | ${site.name}`,
  description:
    "Conheça os cursos de Teatro Musical, Street Dance e K-pop do Mads Project para crianças e jovens em São Paulo.",
  openGraph: {
    title: `Cursos | ${site.name}`,
    description:
      "Formação artística em Teatro Musical, Street Dance e K-pop para crianças e jovens.",
    url: `${site.url}/cursos/`,
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <CursosPage />;
}
