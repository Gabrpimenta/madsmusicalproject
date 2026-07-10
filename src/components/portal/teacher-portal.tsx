"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Download,
  FileUp,
  Loader2,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import { formatBytes } from "@/lib/site-content";
import {
  fileCategories,
  formatPortalDate,
  getUploadLimitFromSetting,
  portalBucket,
  sanitizeFileName,
} from "@/lib/portal";
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

export function TeacherPortal() {
  return (
    <PortalAuthGate title="Area do professor" allowedRoles={["teacher", "admin"]}>
      {(context) => <TeacherPortalContent {...context} />}
    </PortalAuthGate>
  );
}

function TeacherPortalContent({ client, profile }: PortalContext) {
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [files, setFiles] = useState<FileWithGroup[]>([]);
  const [uploadLimit, setUploadLimit] = useState(10 * 1024 * 1024);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: fileCategories[0],
    groupId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalBytes = useMemo(
    () => files.reduce((sum, file) => sum + Number(file.size_bytes ?? 0), 0),
    [files],
  );

  async function loadTeacherData() {
    setLoading(true);
    setError(null);

    const { data: settingData } = await client
      .from("portal_settings")
      .select("value")
      .eq("key", "max_upload_bytes")
      .maybeSingle();

    const settingRow = settingData as { value?: string } | null;
    setUploadLimit(getUploadLimitFromSetting(settingRow?.value));

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
        .eq("role", "teacher");

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
    setForm((current) => ({
      ...current,
      groupId: current.groupId || nextGroups[0]?.id || "",
    }));

    if (nextGroups.length === 0 && profile.role !== "admin") {
      setFiles([]);
      setLoading(false);
      return;
    }

    let query = client
      .from("portal_files")
      .select("*, course_groups(name)")
      .order("created_at", { ascending: false });

    if (profile.role !== "admin") {
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
        void loadTeacherData();
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file && !form.title) {
      setForm((current) => ({
        ...current,
        title: file.name.replace(/\.[^.]+$/, ""),
      }));
    }
  }

  async function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedFile) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    if (!form.groupId) {
      setError("Selecione a turma que recebera o arquivo.");
      return;
    }

    if (selectedFile.size > uploadLimit) {
      setError(`Este arquivo tem ${formatBytes(selectedFile.size)}. O limite atual e ${formatBytes(uploadLimit)}.`);
      return;
    }

    setSaving(true);

    const storagePath = `${form.groupId}/${profile.id}/${Date.now()}-${sanitizeFileName(
      selectedFile.name,
    )}`;

    const { error: uploadError } = await client.storage
      .from(portalBucket)
      .upload(storagePath, selectedFile, {
        cacheControl: "3600",
        contentType: selectedFile.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      setSaving(false);
      setError(uploadError.message);
      return;
    }

    const { error: metadataError } = await client.from("portal_files").insert({
      group_id: form.groupId,
      uploaded_by: profile.id,
      title: form.title.trim() || selectedFile.name,
      description: form.description.trim() || null,
      category: form.category,
      storage_path: storagePath,
      original_name: selectedFile.name,
      mime_type: selectedFile.type || null,
      size_bytes: selectedFile.size,
      active: true,
    });

    if (metadataError) {
      await client.storage.from(portalBucket).remove([storagePath]);
      setSaving(false);
      setError(metadataError.message);
      return;
    }

    setSaving(false);
    setSelectedFile(null);
    setForm((current) => ({
      title: "",
      description: "",
      category: current.category,
      groupId: current.groupId,
    }));
    setMessage("Arquivo enviado com sucesso.");
    await loadTeacherData();
  }

  async function archiveFile(file: FileWithGroup) {
    setError(null);
    const { error: archiveError } = await client
      .from("portal_files")
      .update({
        active: false,
        archived_at: new Date().toISOString(),
      })
      .eq("id", file.id);

    if (archiveError) {
      setError(archiveError.message);
      return;
    }

    await loadTeacherData();
  }

  async function downloadFile(file: FileWithGroup) {
    const { data, error: signedUrlError } = await client.storage
      .from(portalBucket)
      .createSignedUrl(file.storage_path, 90, {
        download: file.original_name,
      });

    if (signedUrlError || !data?.signedUrl) {
      setError(signedUrlError?.message ?? "Nao foi possivel gerar o download.");
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
          <p className="mads-label">Arquivos enviados</p>
          <p className="font-serif text-4xl font-semibold text-white">{files.length}</p>
        </div>
        <div className="portal-surface p-5">
          <p className="mads-label">Limite por upload</p>
          <p className="font-serif text-4xl font-semibold text-white">
            {formatBytes(uploadLimit)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <section className="portal-surface p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mads-accent/[.18] text-mads-accent-soft">
              <UploadCloud size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">
                Enviar material
              </h2>
              <p className="mt-1 text-sm text-mads-faint">
                PDFs, partituras, roteiros e comunicados leves funcionam melhor.
              </p>
            </div>
          </div>

          <form className="grid gap-5" onSubmit={submitUpload}>
            <div>
              <label className="mads-label" htmlFor="teacher-group">
                Turma
              </label>
              <select
                className="mads-field"
                id="teacher-group"
                required
                value={form.groupId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, groupId: event.target.value }))
                }
              >
                <option value="">Selecione</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mads-label" htmlFor="teacher-title">
                Titulo
              </label>
              <input
                className="mads-field"
                id="teacher-title"
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Ex: Letra da musica da aula 03"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="teacher-category">
                Categoria
              </label>
              <select
                className="mads-field"
                id="teacher-category"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                {fileCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mads-label" htmlFor="teacher-description">
                Descricao
              </label>
              <textarea
                className="mads-field min-h-24 resize-y"
                id="teacher-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Instrucao curta para a turma"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="teacher-file">
                Arquivo
              </label>
              <input
                className="mads-field"
                id="teacher-file"
                type="file"
                onChange={onFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp3,.m4a"
              />
              <p className="mt-2 text-xs leading-5 text-mads-faint">
                Limite atual: {formatBytes(uploadLimit)} por arquivo.
              </p>
            </div>

            {error ? (
              <p className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving || groups.length === 0}
              className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <FileUp size={18} aria-hidden="true" />
              )}
              Enviar arquivo
            </button>
          </form>
        </section>

        <section className="portal-surface p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">
                Materiais publicados
              </h2>
              <p className="mt-1 text-sm text-mads-faint">
                Total nesta lista: {formatBytes(totalBytes)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadTeacherData()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] p-5 text-mads-muted">
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Carregando...
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[.025] p-6 text-sm leading-6 text-mads-muted">
              Nenhum material publicado ainda.
            </div>
          ) : (
            <div className="grid gap-3">
              {files.map((file) => {
                const group = firstItem(file.course_groups);
                const archived = Boolean(file.archived_at) || !file.active;
                return (
                  <article
                    key={file.id}
                    className={`rounded-xl border p-4 ${
                      archived
                        ? "border-white/[.08] bg-white/[.015] opacity-65"
                        : "border-white/10 bg-white/[.025]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">{file.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-mads-faint">
                          {group?.name ?? "Turma"} · {file.category ?? "Material"} ·{" "}
                          {formatBytes(file.size_bytes)} · {formatPortalDate(file.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void downloadFile(file)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[.12] text-white/75 hover:border-mads-accent/45 hover:text-white"
                          aria-label={`Baixar ${file.title}`}
                        >
                          <Download size={16} aria-hidden="true" />
                        </button>
                        {!archived ? (
                          <button
                            type="button"
                            onClick={() => void archiveFile(file)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[.12] text-white/75 hover:border-mads-accent/45 hover:text-white"
                            aria-label={`Arquivar ${file.title}`}
                          >
                            <Archive size={16} aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
