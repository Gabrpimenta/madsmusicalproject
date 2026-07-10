import type { UserRole } from "@/lib/supabase/database.types";
import { withBasePath } from "@/lib/site-content";
import { portalStorageLimitBytes, portalUploadLimitBytes } from "@/lib/site-content";

export const portalBucket = "portal-files";
export const defaultUploadLimitBytes = portalUploadLimitBytes;
export const defaultStorageBudgetBytes = portalStorageLimitBytes;

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  teacher: "Professor",
  student: "Aluno",
};

export const roleHome: Record<UserRole, string> = {
  admin: "/portal/admin/",
  teacher: "/portal/professor/",
  student: "/portal/aluno/",
};

export const fileCategories = [
  "Comunicado",
  "Aula",
  "Partitura",
  "Roteiro",
  "Coreografia",
  "Referencia",
  "Outro",
];

export function sanitizeFileName(name: string) {
  const safeName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return safeName || "arquivo";
}

export function formatPortalDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getStoragePercent(bytes: number, budget = defaultStorageBudgetBytes) {
  if (!budget) return 0;
  return Math.min(100, Math.round((bytes / budget) * 100));
}

export function getUploadLimitFromSetting(value: string | number | null | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultUploadLimitBytes;
  }

  return Math.min(parsed, 25 * 1024 * 1024);
}

export function getAuthRedirectTo(path = "/portal/") {
  if (typeof window !== "undefined") {
    return new URL(withBasePath(path), window.location.origin).toString();
  }

  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://madsmusicalproject.com"}${path}`;
}
