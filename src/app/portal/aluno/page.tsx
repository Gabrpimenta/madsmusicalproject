import type { Metadata } from "next";
import { StudentPortal } from "@/components/portal/student-portal";

export const metadata: Metadata = {
  title: "Area do Aluno | Mads Project",
  description: "Materiais e downloads das turmas do Mads Project.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentPortalPage() {
  return <StudentPortal />;
}
