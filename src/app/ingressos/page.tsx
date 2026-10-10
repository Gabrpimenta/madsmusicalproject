import type { Metadata } from "next";
import { IngressosPage } from "@/components/ingressos-page";
import { site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Ingressos | Escola do Rock | ${site.name}`,
  description:
    "Informações para comprar ingressos do espetáculo Escola do Rock. Vendas separadas para Bakhita e Mads Project, com pagamento via Pix.",
  alternates: {
    canonical: `${site.url}/ingressos/`,
  },
  openGraph: {
    title: `Ingressos | Escola do Rock | ${site.name}`,
    description:
      "Escolha a venda Bakhita ou Mads Project e consulte a equipe para comprar seu ingresso via Pix.",
    url: `${site.url}/ingressos/`,
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <IngressosPage />;
}
