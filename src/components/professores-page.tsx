"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CaretDown,
  ChalkboardTeacher,
  InstagramLogo,
  List,
  Moon,
  Sun,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { navLinks, site, teacherProfiles } from "@/lib/site-content";

type ThemeMode = "dark" | "light";

const madsEase = [0.2, 0.7, 0.2, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.14 },
  transition: { duration: 0.8, ease: madsEase },
};

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem("mads-theme");

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: ThemeMode;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-mads-border bg-mads-surface text-mads-text transition hover:border-mads-accent hover:text-mads-accent"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? (
        <Sun size={17} weight="bold" />
      ) : (
        <Moon size={17} weight="bold" />
      )}
    </button>
  );
}

export function ProfessoresPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        setTheme(getInitialTheme());
        setThemeReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (themeReady) {
      window.localStorage.setItem("mads-theme", theme);
    }
  }, [theme, themeReady]);

  return (
    <main
      id="top"
      className="public-site relative min-h-screen overflow-hidden bg-mads-bg text-mads-text"
      data-theme={theme}
    >
      <div className="mads-grain" aria-hidden="true" />

      <header className="site-header fixed inset-x-0 top-0 z-50 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-11 lg:py-6">
          <Link href="/#inicio" className="flex items-center gap-3">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={56}
              height={56}
              className="h-12 w-12 rounded-xl object-cover shadow-[0_6px_20px_rgba(123,92,240,.42)] lg:h-14 lg:w-14"
            />
            <span className="sr-only">Mads Project</span>
          </Link>

          <div className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted transition hover:text-mads-text"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={
                    link.href === "/professores/" ? "page" : undefined
                  }
                  className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted transition hover:text-mads-text aria-[current=page]:text-mads-accent"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/#contato"
              className="mads-cta rounded-xl px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition"
            >
              Matricule-se
            </Link>
            <ThemeToggle
              theme={theme}
              onToggle={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-mads-border bg-mads-surface xl:hidden"
            onClick={() => setNavOpen((current) => !current)}
            aria-label="Abrir menu"
          >
            {navOpen ? (
              <X size={19} weight="bold" />
            ) : (
              <List size={19} weight="bold" />
            )}
          </button>
        </nav>

        {navOpen ? (
          <div className="mx-5 mb-4 rounded-2xl border border-mads-border bg-mads-panel p-4 shadow-2xl xl:hidden">
            <div className="grid gap-2">
              {navLinks.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setNavOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-mads-muted hover:bg-mads-surface hover:text-mads-text"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setNavOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-mads-muted hover:bg-mads-surface hover:text-mads-text"
                    >
                      {link.label}
                    </Link>
                  ),
              )}
              <button
                type="button"
                onClick={() => {
                  setTheme((current) => (current === "dark" ? "light" : "dark"));
                  setNavOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-mads-muted hover:bg-mads-surface hover:text-mads-text"
              >
                {theme === "dark" ? (
                  <Sun size={17} weight="bold" />
                ) : (
                  <Moon size={17} weight="bold" />
                )}
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <section className="relative overflow-hidden px-5 pb-14 pt-32 sm:px-8 lg:px-11 lg:pb-20 lg:pt-40">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--mads-bg)_0%,transparent_48%,var(--mads-bg)_100%)]" />
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            {...reveal}
            className="mx-auto flex w-fit items-center gap-3 text-[12px] font-bold uppercase tracking-[0.24em] text-mads-accent"
          >
            <ChalkboardTeacher size={18} weight="duotone" aria-hidden="true" />
            Corpo docente
          </motion.div>
          <motion.h1
            {...reveal}
            className="mx-auto mt-6 max-w-5xl text-center font-serif text-[clamp(48px,8vw,118px)] font-semibold leading-[.96]"
          >
            Professores
          </motion.h1>
          <motion.p
            {...reveal}
            className="mx-auto mt-7 max-w-3xl text-center text-lg font-light leading-8 text-mads-muted sm:text-xl"
          >
            Um time de artistas que ensina com paixão, técnica e olhar atento
            para o desenvolvimento de cada aluno.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-24 sm:px-8 lg:px-11 lg:pb-32">
        <motion.div
          {...reveal}
          className="mb-12 grid gap-5 rounded-lg border border-mads-border bg-mads-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,.12)] md:grid-cols-[auto_1fr] md:items-center md:p-8"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-mads-border bg-mads-surface text-mads-accent">
            <UsersThree size={28} weight="duotone" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-3xl font-semibold">
              Artistas em cena, educadores em sala.
            </h2>
            <p className="mt-3 max-w-4xl text-base font-light leading-7 text-mads-muted">
              Nossos professores são mentores, artistas atuantes e educadores
              que trazem vivência de palco para aulas de canto, teatro, dança e
              teatro musical.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {teacherProfiles.map((teacher, index) => (
            <motion.article
              key={teacher.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.06 }}
              className="rounded-lg border border-mads-border bg-mads-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,.12)]"
            >
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border border-mads-border bg-mads-surface p-1 shadow-[0_0_34px_rgba(123,92,240,.18)]">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={teacher.image}
                    alt={`Retrato de ${teacher.name}.`}
                    fill
                    className="object-cover"
                    style={{ objectPosition: teacher.imagePosition }}
                    sizes="160px"
                  />
                </div>
              </div>
              <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-mads-accent">
                  {teacher.role}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight">
                  {teacher.name}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {teacher.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="mads-pill rounded-full border border-mads-border bg-mads-surface px-3 py-1.5 text-xs font-bold text-mads-muted"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 text-[15px] font-light leading-7 text-mads-muted">
                  {teacher.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal} className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#contato"
            className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-white transition"
          >
            Falar sobre aulas
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-mads-border bg-mads-surface px-7 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-mads-text transition hover:border-mads-accent hover:text-mads-accent"
          >
            <InstagramLogo size={18} weight="duotone" aria-hidden="true" />
            Instagram
          </a>
        </motion.div>
      </section>

      <footer className="bg-mads-footer px-5 py-16 sm:px-8 lg:px-11">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 border-b border-mads-border pb-12 md:grid-cols-2">
            <div className="flex max-w-xl items-center gap-5">
              <Image
                src={site.logo}
                alt="Mads Project"
                width={72}
                height={72}
                className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover shadow-[0_8px_26px_rgba(123,92,240,.28)]"
              />
              <p className="font-serif text-[20px] font-medium leading-snug min-[430px]:text-[22px] md:text-[26px]">
                Formando artistas conscientes do poder transformador da arte.
              </p>
            </div>
            <div className="flex flex-col gap-6 md:items-end">
              <div className="flex flex-wrap gap-6 md:justify-end">
                {navLinks.slice(0, 5).map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted hover:text-mads-text"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted hover:text-mads-text"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mads-muted hover:text-mads-accent"
              >
                {site.instagramHandle}
              </a>
            </div>
          </div>
          <p className="pt-8 text-xs uppercase tracking-[0.16em] text-mads-faint">
            © 2026 Mads Project. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <a
        href="#top"
        className="mads-cta fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white transition md:h-14 md:w-14"
        aria-label="Voltar ao topo"
      >
        <CaretDown className="rotate-180" size={24} weight="bold" />
      </a>
    </main>
  );
}
