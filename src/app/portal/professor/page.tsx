import type { Metadata } from "next";
import { TeacherPortal } from "@/components/portal/teacher-portal";

export const metadata: Metadata = {
  title: "Area do Professor | Mads Project",
  description: "Envio de arquivos e materiais para turmas do Mads Project.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherPortalPage() {
  return <TeacherPortal />;
}
