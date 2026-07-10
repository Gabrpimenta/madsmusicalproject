"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import { formatBytes } from "@/lib/site-content";
import { formatPortalDate, portalBucket } from "@/lib/portal";
import type { CourseGroup, PortalFile } from "@/lib/supabase/database.types";
import { PortalAuthGate, type PortalContext } from "@/components/portal/portal-auth";

type MembershipWithGroup = {
  group_id: string;
  course_groups: CourseGroup | CourseGroup[] | null;
};

type FileWithGroup = PortalFile & {
  course_groups: Pick<CourseGroup, "name"> | Pick<CourseGroup, "name">[] | null;
};

function firstItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function StudentPortal() {
  return (
    <PortalAuthGate title="Area do aluno" allowedRoles={["student", "admin"]}>
      {(context) => <StudentPortalContent {...context} />}
    </PortalAuthGate>
  );
}

function StudentPortalContent({ client, profile }: PortalContext) {
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [files, setFiles] = useState<FileWithGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalBytes = useMemo(
    () => files.reduce((sum, file) => sum + Number(file.size_bytes ?? 0), 0),
    [files],
  );

  async function loadStudentData() {
    setLoading(true);
    setError(null);

    let nextGroups: CourseGroup[] = [];

    if (profile.role === "admin") {
      const { data: groupData, error: groupError } = await client
        .from("course_groups")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

      if (groupError) {
        setError(groupError.message);
        setLoading(false);
        return;
      }

      nextGroups = groupData ?? [];
    } else {
      const { data: membershipData, error: membershipError } = await client
        .from("group_memberships")
        .select("group_id, course_groups(id,name,description,active,created_at,updated_at)")
        .eq("profile_id", profile.id)
        .eq("role", "student");

      if (membershipError) {
        setError(membershipError.message);
        setLoading(false);
        return;
      }

      nextGroups = ((membershipData ?? []) as unknown as MembershipWithGroup[])
        .map((membership) => firstItem(membership.course_groups))
        .filter((group): group is CourseGroup => Boolean(group?.active));
    }

    setGroups(nextGroups);

    if (nextGroups.length === 0 && profile.role !== "admin") {
      setFiles([]);
      setLoading(false);
      return;
    }

    let query = client
      .from("portal_files")
      .select("*, course_groups(name)")
      .eq("active", true)
      .is("archived_at", null)
      .order("created_at", { ascending: false });

    if (nextGroups.length > 0) {
      query = query.in(
        "group_id",
        nextGroups.map((group) => group.id),
      );
    }

    const { data: fileData, error: fileError } = await query;

    if (fileError) {
      setError(fileError.message);
      setLoading(false);
      return;
    }

    setFiles((fileData ?? []) as unknown as FileWithGroup[]);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void loadStudentData();
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  async function downloadFile(file: FileWithGroup) {
    setDownloadingId(file.id);
    setError(null);

    const { data, error: signedUrlError } = await client.storage
      .from(portalBucket)
      .createSignedUrl(file.storage_path, 90, {
        download: file.original_name,
      });

    setDownloadingId(null);

    if (signedUrlError || !data?.signedUrl) {
      setError(signedUrlError?.message ?? "Nao foi possivel gerar o link de download.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="portal-surface p-5">
          <p className="mads-label">Turmas</p>
          <p className="font-serif text-4xl font-semibold text-white">{groups.length}</p>
        </div>
        <div className="portal-surface p-5">
          <p className="mads-label">Arquivos</p>
          <p className="font-serif text-4xl font-semibold text-white">{files.length}</p>
        </div>
        <div className="portal-surface p-5">
          <p className="mads-label">Tamanho total</p>
          <p className="font-serif text-4xl font-semibold text-white">
            {formatBytes(totalBytes)}
          </p>
        </div>
      </div>

      <div className="portal-surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-white">
              Arquivos disponiveis
            </h2>
            <p className="mt-2 text-sm text-mads-faint">
              Voce ve somente os materiais das turmas vinculadas ao seu cadastro.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadStudentData()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Atualizar
          </button>
        </div>

        {error ? (
          <p className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] p-5 text-mads-muted">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            Carregando arquivos...
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[.025] p-6 text-sm leading-6 text-mads-muted">
            Nenhum arquivo liberado ainda. Quando a equipe publicar materiais,
            eles aparecerao aqui.
          </div>
        ) : (
          <div className="grid gap-3">
            {files.map((file) => {
              const group = firstItem(file.course_groups);
              return (
                <article
                  key={file.id}
                  className="grid gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="flex min-w-0 gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mads-accent/[.18] text-mads-accent-soft">
                      <FileText size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-white">{file.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-mads-faint">
                        {group?.name ?? "Turma"} · {file.category ?? "Material"} ·{" "}
                        {formatBytes(file.size_bytes)} · {formatPortalDate(file.created_at)}
                      </p>
                      {file.description ? (
                        <p className="mt-2 text-sm leading-6 text-mads-muted">
                          {file.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void downloadFile(file)}
                    disabled={downloadingId === file.id}
                    className="mads-cta inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {downloadingId === file.id ? (
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    ) : (
                      <Download size={16} aria-hidden="true" />
                    )}
                    Baixar
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
