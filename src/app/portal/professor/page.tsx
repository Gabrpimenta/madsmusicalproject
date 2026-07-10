import type { Metadata } from "next";
import { TeacherPortal } from "@/components/portal/teacher-portal";

export const metadata: Metadata = {
  title: "Area do Professor | Mads Project",
  description: "Envio de arquivos e materiais para turmas do Mads Project.",
};

export default function TeacherPortalPage() {
  return <TeacherPortal />;
}
