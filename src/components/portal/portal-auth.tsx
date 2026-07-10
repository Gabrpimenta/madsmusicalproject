"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  LogOut,
  ShieldAlert,
  UserCircle2,
} from "lucide-react";
import { adminDefaultMessage, portalSetupSteps, site } from "@/lib/site-content";
import { roleHome, roleLabels } from "@/lib/portal";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Database, Profile, UserRole } from "@/lib/supabase/database.types";

type PortalAuthState = {
  client: SupabaseClient<Database> | null;
  session: Session | null;
  profile: Profile | null;
  configured: boolean;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

export type PortalContext = {
  client: SupabaseClient<Database>;
  session: Session;
  profile: Profile;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const portalNav: Array<{ href: string; label: string; roles: UserRole[] }> = [
  { href: "/portal/aluno/", label: "Aluno", roles: ["student", "admin"] },
  { href: "/portal/professor/", label: "Professor", roles: ["teacher", "admin"] },
  { href: "/portal/admin/", label: "Admin", roles: ["admin"] },
];

export function usePortalAuth(): PortalAuthState {
  const client = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(client));
  const [error, setError] = useState<string | null>(null);

  async function fetchProfile(nextSession = session) {
    if (!client || !nextSession?.user.id) {
      setProfile(null);
      return;
    }

    const { data, error: profileError } = await client
      .from("profiles")
      .select("*")
      .eq("id", nextSession.user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setProfile(null);
      return;
    }

    setProfile(data);
  }

  useEffect(() => {
    if (!client) {
      return;
    }

    let mounted = true;

    client.auth
      .getSession()
      .then(async ({ data, error: sessionError }) => {
        if (!mounted) return;
        if (sessionError) {
          setError(sessionError.message);
        }

        setSession(data.session);

        if (data.session) {
          await fetchProfile(data.session);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void fetchProfile(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // fetchProfile intentionally reads the latest component state through closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return {
    client,
    session,
    profile,
    configured: Boolean(client),
    loading,
    error,
    refreshProfile: () => fetchProfile(),
    signOut: async () => {
      if (!client) return;
      await client.auth.signOut();
      setSession(null);
      setProfile(null);
    },
  };
}

export function PortalSetupNotice() {
  return (
    <PortalPageFrame>
      <section className="mx-auto grid min-h-screen max-w-3xl place-items-center px-5 py-24">
        <div className="portal-surface p-6 sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-mads-accent/[.18] text-mads-accent-soft">
            <ShieldAlert size={26} aria-hidden="true" />
          </div>
          <p className="mads-label">Configuracao pendente</p>
          <h1 className="font-serif text-4xl font-semibold text-white">
            Portal pronto para conectar ao Supabase
          </h1>
          <p className="mt-4 text-base leading-7 text-mads-muted">
            {adminDefaultMessage}
          </p>
          <ol className="mt-7 grid gap-3 text-sm leading-6 text-white/[.72]">
            {portalSetupSteps.map((step) => (
              <li key={step} className="rounded-xl border border-white/10 bg-white/[.025] p-4">
                {step}
              </li>
            ))}
          </ol>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-mads-accent-soft"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>
        </div>
      </section>
    </PortalPageFrame>
  );
}

export function PortalPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(155,109,255,.28),transparent_35%),linear-gradient(180deg,#13091b,#0e0813_48%,#08050d)] text-mads-text">
      <div className="mads-grain" aria-hidden="true" />
      {children}
    </main>
  );
}

function PortalStatus({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <PortalPageFrame>
      <section className="mx-auto grid min-h-screen max-w-xl place-items-center px-5 py-24 text-center">
        <div className="portal-surface p-6 sm:p-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mads-accent/[.18] text-mads-accent-soft">
            <UserCircle2 size={24} aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-4 text-sm leading-6 text-mads-muted">{message}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>
        </div>
      </section>
    </PortalPageFrame>
  );
}

export function PortalAuthGate({
  title,
  allowedRoles,
  children,
}: {
  title: string;
  allowedRoles: UserRole[];
  children: (context: PortalContext) => React.ReactNode;
}) {
  const auth = usePortalAuth();

  if (!auth.configured) {
    return <PortalSetupNotice />;
  }

  if (auth.loading) {
    return (
      <PortalStatus
        title="Carregando portal"
        message="Estamos verificando sua sessao e suas permissoes."
        action={<Loader2 className="animate-spin text-mads-accent-soft" size={22} />}
      />
    );
  }

  if (!auth.session) {
    return (
      <PortalStatus
        title="Entre para continuar"
        message="Use o e-mail cadastrado pela escola para acessar os materiais da sua turma."
        action={
          <Link className="mads-cta rounded-xl px-5 py-3 text-sm font-bold" href="/portal/">
            Fazer login
          </Link>
        }
      />
    );
  }

  if (auth.error || !auth.profile) {
    return (
      <PortalStatus
        title="Perfil nao encontrado"
        message={
          auth.error ??
          "Seu login existe, mas ainda nao encontramos um perfil ativo no portal. Fale com a administracao da escola."
        }
        action={
          <button
            type="button"
            onClick={() => void auth.signOut()}
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white/85"
          >
            Sair
          </button>
        }
      />
    );
  }

  if (!auth.profile.active) {
    return (
      <PortalStatus
        title="Conta inativa"
        message="Esta conta esta inativa. Fale com a administracao para reativar o acesso."
        action={
          <button
            type="button"
            onClick={() => void auth.signOut()}
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white/85"
          >
            Sair
          </button>
        }
      />
    );
  }

  if (!allowedRoles.includes(auth.profile.role)) {
    return (
      <PortalStatus
        title="Acesso restrito"
        message="Seu perfil nao possui permissao para esta area do portal."
        action={
          <Link
            href={roleHome[auth.profile.role]}
            className="mads-cta rounded-xl px-5 py-3 text-sm font-bold"
          >
            Ir para minha area
          </Link>
        }
      />
    );
  }

  const client = auth.client;

  if (!client) {
    return <PortalSetupNotice />;
  }

  return (
    <PortalShell
      title={title}
      profile={auth.profile}
      signOut={auth.signOut}
    >
      {children({
        client,
        session: auth.session,
        profile: auth.profile,
        refreshProfile: auth.refreshProfile,
        signOut: auth.signOut,
      })}
    </PortalShell>
  );
}

function PortalShell({
  title,
  profile,
  signOut,
  children,
}: {
  title: string;
  profile: Profile;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const visibleNav = portalNav.filter((item) => item.roles.includes(profile.role));

  return (
    <PortalPageFrame>
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 py-5 sm:px-8 lg:px-11">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-cover shadow-[0_8px_24px_rgba(123,92,240,.35)]"
            />
            <span>
              <span className="block font-serif text-xl font-semibold text-white">
                {site.name}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-mads-faint">
                Portal
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {visibleNav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-mads-accent text-white"
                      : "border border-white/10 text-white/[.68] hover:border-mads-accent/50 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <div className="grid flex-1 gap-7 py-8 lg:grid-cols-[260px_1fr]">
          <aside className="portal-surface h-fit p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[.08] text-mads-accent-soft">
                <BookOpen size={21} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{profile.full_name}</p>
                <p className="mt-1 truncate text-sm text-mads-faint">{profile.email}</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[.025] p-4 text-sm text-mads-muted">
              <span className="mads-label mb-2">Perfil</span>
              <span className="text-white">{roleLabels[profile.role]}</span>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[.12] px-4 py-3 text-sm font-bold text-white/75 transition hover:border-mads-accent/45 hover:text-white"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-mads-accent-soft transition hover:bg-white/5"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar ao site
            </Link>
          </aside>

          <section className="min-w-0">
            <div className="mb-7">
              <p className="mads-label">Portal do Aluno</p>
              <h1 className="font-serif text-[clamp(34px,5vw,58px)] font-semibold leading-tight text-white">
                {title}
              </h1>
            </div>
            {children}
          </section>
        </div>
      </div>
    </PortalPageFrame>
  );
}
