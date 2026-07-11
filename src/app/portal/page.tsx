import type { Metadata } from "next";
import { PortalLogin } from "@/components/portal/portal-login";

export const metadata: Metadata = {
  title: "Portal do Aluno | Mads Project",
  description: "Acesso restrito para alunos, professores e administradores.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalPage() {
  return <PortalLogin />;
}
