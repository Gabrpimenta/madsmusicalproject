"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CalendarDots,
  CaretDown,
  CheckCircle,
  InstagramLogo,
  List,
  Moon,
  Sun,
  UserFocus,
  X,
} from "@phosphor-icons/react";
import { coursePrograms, navLinks, site } from "@/lib/site-content";

type ThemeMode = "dark" | "light";

type CourseMedia = {
  src: string;
  poster: string;
  label: string;
  orientation: "portrait" | "landscape";
};

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
  if (saved === "light" || saved === "dark") return saved;

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

function CourseMediaShowcase({ media }: { media: CourseMedia }) {
  return (
    <motion.div
      {...reveal}
      className="mx-auto mt-12 w-full max-w-[1180px] border-t border-mads-border pt-8 sm:mt-16 sm:pt-10"
    >
      <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-mads-accent">
        Vivência em aula
      </p>
      <div className="course-media-frame relative mx-auto aspect-video w-full overflow-hidden rounded-lg border border-mads-border bg-[#09070b] shadow-[0_24px_80px_rgba(0,0,0,.34)]">
        <video
          controls
          playsInline
          preload="metadata"
          poster={media.poster}
          className="h-full w-full object-contain"
          aria-label={media.label}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
}

export function CursosPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

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
    if (themeReady) window.localStorage.setItem("mads-theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

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
              priority
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
                  aria-current={link.href === site.coursesUrl ? "page" : undefined}
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
              {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-mads-muted hover:bg-mads-surface hover:text-mads-text"
                  >
                    {link.label}
                  </Link>
                ))}
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

      <section
        ref={heroRef}
        className="relative isolate flex min-h-[100svh] items-end overflow-hidden px-5 pb-16 pt-36 text-white sm:px-8 lg:px-11 lg:pb-24"
      >
        <Image
          src={site.heroPoster}
          alt="Alunos do Mads Project durante uma apresentação de teatro musical."
          fill
          priority
          className="-z-20 object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,4,12,.96)_0%,rgba(8,4,12,.72)_54%,rgba(8,4,12,.34)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(8,4,12,.88)_0%,transparent_60%)]" />
        <div className="mx-auto w-full max-w-[1500px]">
          <motion.p
            {...reveal}
            className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#d8b7ff]"
          >
            Formação Mads
          </motion.p>
        <motion.h1
            {...reveal}
            className="mt-5 max-w-[1280px] text-balance font-serif text-[40px] font-semibold leading-[1.02] min-[390px]:text-[46px] sm:text-[58px] lg:text-[72px] xl:text-[80px]"
          >
            <span className="block">Cursos para criar,</span>
            <span className="block italic text-[#d8b7ff]">
              se expressar e crescer.
            </span>
          </motion.h1>
          <motion.p
            {...reveal}
            className="mt-6 max-w-2xl text-base font-light leading-7 text-white/78 sm:mt-7 sm:text-xl sm:leading-8"
          >
            Teatro Musical, Street Dance e K-pop em processos que unem técnica,
            acolhimento e experiências reais de palco.
          </motion.p>
          <motion.div {...reveal} className="mt-8 flex max-w-[340px] flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#escolha"
              className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-white sm:px-7 sm:tracking-[0.16em]"
            >
              Explorar os cursos
              <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </a>
            <Link
              href="/#contato"
              className="inline-flex items-center justify-center rounded-xl border border-white/35 bg-black/20 px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:border-white/70 sm:px-7 sm:tracking-[0.16em]"
            >
              Falar com a equipe
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="escolha" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-11 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...reveal}>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-mads-accent">
              Escolha uma experiência
            </p>
            <h2 className="mt-5 text-balance font-serif text-[40px] font-semibold leading-[1.08] sm:text-[54px] lg:text-[62px]">
              Qual curso combina com <span className="italic">seu filho?</span>
            </h2>
          </motion.div>
          <motion.p
            {...reveal}
            className="mx-auto mt-6 max-w-3xl text-[17px] font-light leading-8 text-mads-muted"
          >
            Cada percurso desenvolve habilidades artísticas e humanas por um
            caminho diferente. Compare as propostas e conheça os detalhes antes
            de conversar com nossa equipe.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {coursePrograms.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.a
                key={course.id}
                href={`#${course.id}`}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
                className="group flex h-full flex-col items-center rounded-lg border border-mads-border bg-mads-panel px-7 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,.12)] transition hover:border-mads-accent"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-mads-border bg-mads-surface text-mads-accent">
                  <Icon size={24} weight="duotone" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-serif text-[34px] font-semibold leading-tight">
                  {course.title}
                </h3>
                <p className="mt-3 min-h-10 text-sm font-bold uppercase tracking-[0.13em] text-mads-faint">
                  {course.eyebrow}
                </p>
                <p className="mt-5 flex-1 text-base font-light leading-7 text-mads-muted">
                  {course.summary}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mads-accent">
                  Conhecer o curso
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      <div className="border-y border-mads-border">
        {coursePrograms.map((course, index) => {
          const Icon = course.icon;
          return (
            <article
              key={course.id}
              id={course.id}
              className={`scroll-mt-24 ${
                index % 2 === 0 ? "bg-mads-surface" : "bg-mads-bg"
              }`}
            >
              <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-11 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-[1.08fr_.72fr] lg:gap-20">
                  <motion.div {...reveal}>
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-mads-border bg-mads-panel text-mads-accent">
                        <Icon size={28} weight="duotone" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-mads-accent">
                        {course.eyebrow}
                      </p>
                    </div>
                    <h2 className="mt-8 font-serif text-[44px] font-semibold leading-none sm:text-[60px]">
                      {course.title}
                    </h2>
                    <p className="mt-7 max-w-3xl font-serif text-2xl font-medium leading-9 text-mads-text/90">
                      {course.summary}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="mads-pill rounded-full border border-mads-border bg-mads-panel px-3 py-1.5 text-xs font-bold text-mads-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-9 grid gap-5 text-[17px] font-light leading-8 text-mads-muted">
                      {course.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>

                <motion.aside {...reveal} className="lg:pt-4">
                  <div className="rounded-lg border border-mads-border bg-mads-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,.12)] sm:p-8">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.facts.map((fact) => {
                        const FactIcon = fact.icon;
                        return (
                          <div
                            key={fact.label}
                            className="flex min-h-20 items-center gap-3 border-b border-mads-border pb-3 sm:min-h-0"
                          >
                            <FactIcon
                              size={20}
                              weight="duotone"
                              className="shrink-0 text-mads-accent"
                              aria-hidden="true"
                            />
                            <span className="text-sm font-semibold text-mads-text">
                              {fact.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <h3 className="mt-8 font-serif text-2xl font-semibold">
                      O que este curso desenvolve
                    </h3>
                    <ul className="mt-6 grid gap-4">
                      {course.objectives.map((objective) => (
                        <li
                          key={objective}
                          className="flex gap-3 text-[15px] leading-6 text-mads-muted"
                        >
                          <CheckCircle
                            size={20}
                            weight="fill"
                            className="mt-0.5 shrink-0 text-mads-accent"
                            aria-hidden="true"
                          />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/#contato"
                      className="mads-cta mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white"
                    >
                      Conversar sobre este curso
                      <ArrowRight size={16} weight="bold" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.aside>
                </div>
                <CourseMediaShowcase media={course.media} />
              </div>
            </article>
          );
        })}
      </div>

      <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-11 lg:py-32">
        <motion.div {...reveal} className="text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-mads-accent">
            Em todos os cursos
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-[40px] font-semibold leading-tight sm:text-[56px]">
            Desenvolvimento artístico com <span className="italic">olhar humano.</span>
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-8 border-y border-mads-border py-10 md:grid-cols-3">
          {[
            {
              icon: CheckCircle,
              title: "Técnica com propósito",
              text: "Fundamentos artísticos aplicados a processos criativos, apresentações e espetáculos.",
            },
            {
              icon: UserFocus,
              title: "Processo acolhedor",
              text: "Cada aluno aprende respeitando seu nível, sua faixa etária e sua individualidade.",
            },
            {
              icon: CalendarDots,
              title: "Experiência de palco",
              text: "Confiança, presença e trabalho em equipe desenvolvidos em experiências práticas.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
              >
                <Icon size={28} weight="duotone" className="text-mads-accent" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-base font-light leading-7 text-mads-muted">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
        <motion.div {...reveal} className="mt-12 flex justify-center">
          <Link
            href="/#contato"
            className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-white sm:px-8 sm:tracking-[0.16em]"
          >
            Encontrar a turma certa
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </Link>
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
              <p className="font-serif text-[16px] font-medium leading-snug min-[430px]:text-[18px] md:text-[26px]">
                Formando artistas conscientes do poder transformador da arte.
              </p>
            </div>
            <div className="flex flex-col gap-6 md:items-end">
              <div className="flex flex-wrap gap-6 md:justify-end">
                {navLinks.slice(0, 5).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted hover:text-mads-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-mads-muted hover:text-mads-accent"
              >
                <InstagramLogo size={18} weight="duotone" aria-hidden="true" />
                {site.instagramHandle}
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 pt-8 text-xs uppercase tracking-[0.16em] text-mads-faint">
            <p>© 2026 Mads Project. Todos os direitos reservados.</p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=gabrielrpimenta%40gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-full border border-mads-accent/20 bg-mads-accent/10 px-3 py-1.5 font-bold text-mads-accent transition hover:border-mads-accent/45 hover:bg-mads-accent/16 hover:text-mads-accent-soft"
            >
              Site feito por Gabriel Pimenta
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop ? (
          <motion.a
            href="#top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.24, ease: madsEase }}
            className="mads-cta fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white md:h-14 md:w-14"
            aria-label="Voltar ao topo"
          >
            <CaretDown className="rotate-180" size={24} weight="bold" />
          </motion.a>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
