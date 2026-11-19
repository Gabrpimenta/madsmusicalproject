import type { Metadata } from "next";
import { IngressosPage } from "@/components/ingressos-page";
import { site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Ingressos | Escola do Rock | ${site.name}`,
  description:
    "As compras de ingresso para o espetáculo Escola do Rock são feitas somente presencialmente no Teatro UNICID.",
  alternates: {
    canonical: `${site.url}/ingressos/`,
  },
  openGraph: {
    title: `Ingressos | Escola do Rock | ${site.name}`,
    description:
      "As vendas pelo site estão encerradas. Compre seu ingresso presencialmente no Teatro UNICID.",
    url: `${site.url}/ingressos/`,
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <IngressosPage />;
}
