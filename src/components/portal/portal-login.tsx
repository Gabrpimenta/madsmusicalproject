"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole, Mail } from "lucide-react";
import { getAuthRedirectTo, roleHome } from "@/lib/portal";
import { site } from "@/lib/site-content";
import { PortalPageFrame, PortalSetupNotice, usePortalAuth } from "@/components/portal/portal-auth";

export function PortalLogin() {
  const router = useRouter();
  const auth = usePortalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.profile?.active) {
      router.replace(roleHome[auth.profile.role]);
    }
  }, [auth.profile, router]);

  if (!auth.configured) {
    return <PortalSetupNotice />;
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!auth.client) return;

    setLoading(true);
    const { error: signInError } = await auth.client.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("Nao foi possivel entrar. Confira e-mail, senha e se a conta ja foi ativada.");
      return;
    }

    setMessage("Login confirmado. Abrindo sua area...");
  }

  async function sendPasswordReset() {
    setError(null);
    setMessage(null);

    if (!auth.client || !email) {
      setError("Informe seu e-mail para receber o link de redefinicao.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await auth.client.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectTo("/portal/"),
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Enviamos um link para redefinir sua senha, se o e-mail estiver cadastrado.");
  }

  return (
    <PortalPageFrame>
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:px-11">
        <div>
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={56}
              height={56}
              className="h-14 w-14 rounded-2xl object-cover shadow-[0_10px_28px_rgba(123,92,240,.4)]"
            />
            <span>
              <span className="block font-serif text-2xl font-semibold">
                Mads Project
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-mads-faint">
                Portal do Aluno
              </span>
            </span>
          </Link>
          <p className="mads-label">Area restrita</p>
          <h1 className="font-serif text-[clamp(42px,6vw,76px)] font-semibold leading-[1.03]">
            Materiais da turma,
            <br />
            <span className="mads-gradient-text italic">sempre a mao.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-mads-muted">
            Entre com o e-mail cadastrado pela escola. Para alunos menores de
            idade, o login pode ser o e-mail do responsavel.
          </p>
          <div className="mt-9 grid max-w-xl gap-4 sm:grid-cols-3">
            {["Arquivos privados", "Login por convite", "Turmas protegidas"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[.025] p-4 text-sm font-bold text-white/[.78]"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="portal-surface p-5 sm:p-8 lg:p-10">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-mads-accent/[.18] text-mads-accent-soft">
            <LockKeyhole size={24} aria-hidden="true" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-white">
            Entrar no portal
          </h2>
          <p className="mt-3 text-sm leading-6 text-mads-muted">
            Contas sao criadas por convite da administracao.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={signIn}>
            <div>
              <label className="mads-label" htmlFor="portal-email">
                E-mail
              </label>
              <input
                className="mads-field"
                id="portal-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="aluno@email.com"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="portal-password">
                Senha
              </label>
              <input
                className="mads-field"
                id="portal-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || auth.loading}
              className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-7 py-5 text-sm font-bold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || auth.loading ? (
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
              Entrar
            </button>
          </form>

          <button
            type="button"
            onClick={() => void sendPasswordReset()}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mads-accent-soft hover:text-white"
          >
            <Mail size={16} aria-hidden="true" />
            Esqueci minha senha
          </button>
        </div>
      </section>
    </PortalPageFrame>
  );
}
