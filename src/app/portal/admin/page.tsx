import type { Metadata } from "next";
import { AdminPortal } from "@/components/portal/admin-portal";

export const metadata: Metadata = {
  title: "Administracao | Mads Project",
  description: "Gestao de usuarios, turmas e arquivos do portal Mads Project.",
};

export default function AdminPortalPage() {
  return <AdminPortal />;
}
