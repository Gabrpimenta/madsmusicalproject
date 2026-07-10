"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Download,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { formatBytes } from "@/lib/site-content";
import {
  defaultStorageBudgetBytes,
  defaultUploadLimitBytes,
  formatPortalDate,
  getStoragePercent,
  getUploadLimitFromSetting,
  portalBucket,
  roleLabels,
} from "@/lib/portal";
import type {
  CourseGroup,
  GroupMembership,
  PortalFile,
  Profile,
  UserRole,
} from "@/lib/supabase/database.types";
import { PortalAuthGate, type PortalContext } from "@/components/portal/portal-auth";

type MembershipWithJoins = GroupMembership & {
  profiles: Pick<Profile, "full_name" | "email" | "role"> | Pick<Profile, "full_name" | "email" | "role">[] | null;
  course_groups: Pick<CourseGroup, "name"> | Pick<CourseGroup, "name">[] | null;
};

type FileWithGroup = PortalFile & {
  course_groups: Pick<CourseGroup, "name"> | Pick<CourseGroup, "name">[] | null;
};

const emptyInvite = {
  email: "",
  fullName: "",
  role: "student" as UserRole,
  phone: "",
  guardianName: "",
  marketingOptIn: true,
  marketingSource: "portal-invite",
  groupIds: [] as string[],
};

function firstItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function csvValue(value: string | null | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function AdminPortal() {
  return (
    <PortalAuthGate title="Administracao" allowedRoles={["admin"]}>
      {(context) => <AdminPortalContent {...context} />}
    </PortalAuthGate>
  );
}

function AdminPortalContent({ client, profile }: PortalContext) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [memberships, setMemberships] = useState<MembershipWithJoins[]>([]);
  const [files, setFiles] = useState<FileWithGroup[]>([]);
  const [uploadLimit, setUploadLimit] = useState(defaultUploadLimitBytes);
  const [newUploadLimitMb, setNewUploadLimitMb] = useState("10");
  const [invite, setInvite] = useState(emptyInvite);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const [membershipForm, setMembershipForm] = useState({
    profileId: "",
    groupId: "",
    role: "student" as "student" | "teacher",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storageBytes = useMemo(
    () => files.reduce((sum, file) => sum + Number(file.size_bytes ?? 0), 0),
    [files],
  );
  const storagePercent = getStoragePercent(storageBytes, defaultStorageBudgetBytes);
  const optedInContacts = profiles.filter(
    (item) => item.marketing_opt_in && !item.unsubscribed_at && item.active,
  );

  async function loadAdminData() {
    setLoading(true);
    setError(null);

    const [profilesResult, groupsResult, membershipsResult, filesResult, settingResult] =
      await Promise.all([
        client.from("profiles").select("*").order("created_at", { ascending: false }),
        client.from("course_groups").select("*").order("name", { ascending: true }),
        client
          .from("group_memberships")
          .select("*, profiles(full_name,email,role), course_groups(name)")
          .order("created_at", { ascending: false }),
        client
          .from("portal_files")
          .select("*, course_groups(name)")
          .order("created_at", { ascending: false }),
        client
          .from("portal_settings")
          .select("value")
          .eq("key", "max_upload_bytes")
          .maybeSingle(),
      ]);

    const firstError =
      profilesResult.error ??
      groupsResult.error ??
      membershipsResult.error ??
      filesResult.error ??
      settingResult.error;

    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const settingRow = settingResult.data as { value?: string } | null;
    const profileRows = (profilesResult.data ?? []) as Profile[];
    const groupRows = (groupsResult.data ?? []) as CourseGroup[];
    const membershipRows = (membershipsResult.data ?? []) as unknown as MembershipWithJoins[];
    const fileRows = (filesResult.data ?? []) as unknown as FileWithGroup[];
    const nextUploadLimit = getUploadLimitFromSetting(settingRow?.value);
    setProfiles(profileRows);
    setGroups(groupRows);
    setMemberships(membershipRows);
    setFiles(fileRows);
    setUploadLimit(nextUploadLimit);
    setNewUploadLimitMb(String(Math.round(nextUploadLimit / 1024 / 1024)));
    setMembershipForm((current) => ({
      ...current,
      profileId: current.profileId || profileRows[0]?.id || "",
      groupId: current.groupId || groupRows[0]?.id || "",
    }));
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void loadAdminData();
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const { error: functionError } = await client.functions.invoke("invite-user", {
      body: {
        email: invite.email,
        fullName: invite.fullName,
        role: invite.role,
        phone: invite.phone || null,
        guardianName: invite.guardianName || null,
        marketingOptIn: invite.marketingOptIn,
        marketingSource: invite.marketingSource || "portal-invite",
        groupIds: invite.groupIds,
      },
    });

    setSaving(false);

    if (functionError) {
      setError(
        `${functionError.message}. Confira se a Edge Function invite-user foi publicada no Supabase.`,
      );
      return;
    }

    setInvite(emptyInvite);
    setMessage("Convite enviado e perfil registrado.");
    await loadAdminData();
  }

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const { error: groupError } = await client.from("course_groups").insert({
      name: groupForm.name.trim(),
      description: groupForm.description.trim() || null,
      active: true,
    });

    if (groupError) {
      setError(groupError.message);
      return;
    }

    setGroupForm({ name: "", description: "" });
    setMessage("Turma criada.");
    await loadAdminData();
  }

  async function saveUploadLimit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const bytes = Math.max(1, Number(newUploadLimitMb)) * 1024 * 1024;
    const { error: settingError } = await client.from("portal_settings").upsert({
      key: "max_upload_bytes",
      value: String(bytes),
      description: "Limite maximo de upload por arquivo.",
      updated_by: profile.id,
    });

    if (settingError) {
      setError(settingError.message);
      return;
    }

    setMessage("Limite de upload atualizado.");
    await loadAdminData();
  }

  async function toggleProfileActive(target: Profile) {
    const { error: profileError } = await client
      .from("profiles")
      .update({ active: !target.active })
      .eq("id", target.id);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    await loadAdminData();
  }

  async function addMembership(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const { error: membershipError } = await client.from("group_memberships").upsert(
      {
        profile_id: membershipForm.profileId,
        group_id: membershipForm.groupId,
        role: membershipForm.role,
      },
      { onConflict: "group_id,profile_id" },
    );

    if (membershipError) {
      setError(membershipError.message);
      return;
    }

    setMessage("Vinculo de turma salvo.");
    await loadAdminData();
  }

  async function removeMembership(membership: GroupMembership) {
    const { error: membershipError } = await client
      .from("group_memberships")
      .delete()
      .eq("id", membership.id);

    if (membershipError) {
      setError(membershipError.message);
      return;
    }

    await loadAdminData();
  }

  async function archiveFile(file: FileWithGroup) {
    const archived = Boolean(file.archived_at) || !file.active;
    const { error: archiveError } = await client
      .from("portal_files")
      .update({
        active: archived,
        archived_at: archived ? null : new Date().toISOString(),
      })
      .eq("id", file.id);

    if (archiveError) {
      setError(archiveError.message);
      return;
    }

    await loadAdminData();
  }

  async function deleteFile(file: FileWithGroup) {
    const confirmed = window.confirm(
      `Excluir definitivamente "${file.title}"? Isso remove o arquivo do Storage.`,
    );

    if (!confirmed) return;

    const { error: storageError } = await client.storage
      .from(portalBucket)
      .remove([file.storage_path]);

    if (storageError) {
      setError(storageError.message);
      return;
    }

    const { error: metadataError } = await client
      .from("portal_files")
      .delete()
      .eq("id", file.id);

    if (metadataError) {
      setError(metadataError.message);
      return;
    }

    await loadAdminData();
  }

  function exportCsv() {
    const rows = [
      ["full_name", "email", "phone", "guardian_name", "marketing_source"].map(csvValue),
      ...optedInContacts.map((contact) =>
        [
          contact.full_name,
          contact.email,
          contact.phone,
          contact.guardian_name,
          contact.marketing_source,
        ].map(csvValue),
      ),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `mads-contatos-opt-in-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
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

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Usuarios" value={profiles.length} />
        <Metric label="Turmas" value={groups.length} />
        <Metric label="Opt-in marketing" value={optedInContacts.length} />
        <Metric label="Upload maximo" value={formatBytes(uploadLimit)} />
      </div>

      <section className="portal-surface p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mads-label">Armazenamento</p>
            <h2 className="font-serif text-2xl font-semibold text-white">
              {formatBytes(storageBytes)} de {formatBytes(defaultStorageBudgetBytes)}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadAdminData()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Atualizar
          </button>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/[.08]">
          <div
            className={`h-full rounded-full ${
              storagePercent >= 80 ? "bg-red-400" : "bg-mads-accent"
            }`}
            style={{ width: `${storagePercent}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-mads-muted">
          {storagePercent >= 80
            ? "Atencao: o portal esta acima de 80% do orcamento gratuito. Arquive e exclua materiais antigos."
            : "Arquivos ficam privados; downloads sao liberados por permissao de turma."}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <section className="portal-surface p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mads-accent/[.18] text-mads-accent-soft">
              <Send size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">
                Convidar usuario
              </h2>
              <p className="mt-1 text-sm text-mads-faint">
                A conta e criada por convite; sem cadastro publico aberto.
              </p>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={submitInvite}>
            <Field
              label="Nome completo"
              value={invite.fullName}
              onChange={(value) => setInvite((current) => ({ ...current, fullName: value }))}
              required
            />
            <Field
              label="E-mail"
              type="email"
              value={invite.email}
              onChange={(value) => setInvite((current) => ({ ...current, email: value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mads-label" htmlFor="invite-role">
                  Perfil
                </label>
                <select
                  id="invite-role"
                  className="mads-field"
                  value={invite.role}
                  onChange={(event) =>
                    setInvite((current) => ({
                      ...current,
                      role: event.target.value as UserRole,
                    }))
                  }
                >
                  <option value="student">Aluno</option>
                  <option value="teacher">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Field
                label="Telefone"
                value={invite.phone}
                onChange={(value) => setInvite((current) => ({ ...current, phone: value }))}
              />
            </div>
            <Field
              label="Responsavel"
              value={invite.guardianName}
              onChange={(value) =>
                setInvite((current) => ({ ...current, guardianName: value }))
              }
            />
            <div>
              <label className="mads-label" htmlFor="invite-groups">
                Turmas
              </label>
              <select
                id="invite-groups"
                className="mads-field min-h-32"
                multiple
                value={invite.groupIds}
                onChange={(event) =>
                  setInvite((current) => ({
                    ...current,
                    groupIds: Array.from(event.target.selectedOptions).map(
                      (option) => option.value,
                    ),
                  }))
                }
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.025] p-4 text-sm leading-6 text-mads-muted">
              <input
                type="checkbox"
                checked={invite.marketingOptIn}
                onChange={(event) =>
                  setInvite((current) => ({
                    ...current,
                    marketingOptIn: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              Autorizou receber informacoes sobre cursos, aulas e novidades.
            </label>
            <button
              type="submit"
              disabled={saving}
              className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Enviar convite
            </button>
          </form>
        </section>

        <section className="grid gap-6">
          <div className="portal-surface p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-white">
              Turmas e limites
            </h2>
            <form className="mt-5 grid gap-4" onSubmit={createGroup}>
              <Field
                label="Nova turma"
                value={groupForm.name}
                onChange={(value) =>
                  setGroupForm((current) => ({ ...current, name: value }))
                }
                required
              />
              <Field
                label="Descricao"
                value={groupForm.description}
                onChange={(value) =>
                  setGroupForm((current) => ({ ...current, description: value }))
                }
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
              >
                <Plus size={16} aria-hidden="true" />
                Criar turma
              </button>
            </form>

            <form className="mt-6 grid gap-4 border-t border-white/10 pt-6" onSubmit={saveUploadLimit}>
              <Field
                label="Limite por upload (MB)"
                type="number"
                value={newUploadLimitMb}
                onChange={setNewUploadLimitMb}
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
              >
                Salvar limite
              </button>
            </form>
          </div>

          <div className="portal-surface p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-white">
              Exportar contatos
            </h2>
            <p className="mt-2 text-sm leading-6 text-mads-muted">
              CSV com contatos ativos que aceitaram comunicacoes.
            </p>
            <button
              type="button"
              onClick={exportCsv}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
            >
              <Download size={16} aria-hidden="true" />
              Baixar CSV
            </button>
          </div>
        </section>
      </div>

      <section className="portal-surface p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Users className="text-mads-accent-soft" size={22} aria-hidden="true" />
          <h2 className="font-serif text-2xl font-semibold text-white">
            Usuarios e vinculos
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] p-5 text-mads-muted">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            Carregando administracao...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-mads-accent-soft">
                  <tr>
                    <th className="py-3 pr-4">Nome</th>
                    <th className="py-3 pr-4">Perfil</th>
                    <th className="py-3 pr-4">Marketing</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[.08] text-mads-muted">
                  {profiles.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 pr-4">
                        <span className="block font-bold text-white">{item.full_name}</span>
                        <span className="block text-xs">{item.email}</span>
                      </td>
                      <td className="py-4 pr-4">{roleLabels[item.role]}</td>
                      <td className="py-4 pr-4">
                        {item.marketing_opt_in && !item.unsubscribed_at ? "Opt-in" : "-"}
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={() => void toggleProfileActive(item)}
                          className="rounded-lg border border-white/[.12] px-3 py-2 text-xs font-bold text-white/75 hover:border-mads-accent/45"
                        >
                          {item.active ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <form className="grid gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4" onSubmit={addMembership}>
                <div>
                  <label className="mads-label" htmlFor="membership-user">
                    Usuario
                  </label>
                  <select
                    id="membership-user"
                    className="mads-field"
                    value={membershipForm.profileId}
                    onChange={(event) =>
                      setMembershipForm((current) => ({
                        ...current,
                        profileId: event.target.value,
                      }))
                    }
                  >
                    {profiles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name} - {roleLabels[item.role]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mads-label" htmlFor="membership-group">
                      Turma
                    </label>
                    <select
                      id="membership-group"
                      className="mads-field"
                      value={membershipForm.groupId}
                      onChange={(event) =>
                        setMembershipForm((current) => ({
                          ...current,
                          groupId: event.target.value,
                        }))
                      }
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mads-label" htmlFor="membership-role">
                      Papel na turma
                    </label>
                    <select
                      id="membership-role"
                      className="mads-field"
                      value={membershipForm.role}
                      onChange={(event) =>
                        setMembershipForm((current) => ({
                          ...current,
                          role: event.target.value as "student" | "teacher",
                        }))
                      }
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/80 hover:border-mads-accent/45"
                >
                  <Plus size={16} aria-hidden="true" />
                  Salvar vinculo
                </button>
              </form>

              <div className="mt-4 grid gap-2">
                {memberships.slice(0, 10).map((membership) => {
                  const memberProfile = firstItem(membership.profiles);
                  const group = firstItem(membership.course_groups);
                  return (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.02] p-3 text-sm text-mads-muted"
                    >
                      <span>
                        <span className="font-bold text-white">
                          {memberProfile?.full_name ?? "Usuario"}
                        </span>{" "}
                        em {group?.name ?? "Turma"} como{" "}
                        {membership.role === "teacher" ? "professor" : "aluno"}
                      </span>
                      <button
                        type="button"
                        onClick={() => void removeMembership(membership)}
                        className="text-white/55 hover:text-red-100"
                        aria-label="Remover vinculo"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="portal-surface p-5 sm:p-6">
        <h2 className="mb-5 font-serif text-2xl font-semibold text-white">
          Arquivar ou excluir arquivos antigos
        </h2>
        <div className="grid gap-3">
          {files.slice(0, 12).map((file) => {
            const group = firstItem(file.course_groups);
            const archived = Boolean(file.archived_at) || !file.active;
            return (
              <article
                key={file.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4"
              >
                <div>
                  <h3 className="font-bold text-white">{file.title}</h3>
                  <p className="mt-1 text-sm text-mads-faint">
                    {group?.name ?? "Turma"} · {formatBytes(file.size_bytes)} ·{" "}
                    {formatPortalDate(file.created_at)}
                    {archived ? " · Arquivado" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void archiveFile(file)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[.12] px-3 py-2 text-sm font-bold text-white/75 hover:border-mads-accent/45"
                  >
                    <Archive size={15} aria-hidden="true" />
                    {archived ? "Restaurar" : "Arquivar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteFile(file)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 px-3 py-2 text-sm font-bold text-red-100 hover:bg-red-500/10"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Excluir
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="portal-surface p-5">
      <p className="mads-label">{label}</p>
      <p className="font-serif text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label className="mads-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="mads-field"
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
