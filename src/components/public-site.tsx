"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  List,
  Moon,
  Sun,
  X,
} from "@phosphor-icons/react";
import {
  contactItems,
  courses,
  essenceImages,
  initialSchoolCopy,
  interestCourses,
  jsonLd,
  marqueeItems,
  navLinks,
  orientadoraQuote,
  site,
} from "@/lib/site-content";
import {
  buildWhatsAppUrl,
  type EnrollmentForm,
} from "@/lib/whatsapp";

type ThemeMode = "dark" | "light";

const madsEase = [0.2, 0.7, 0.2, 1] as const;
const fixedAgeRange = "6 - 18 anos";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.8, ease: madsEase },
};

const emptyForm: EnrollmentForm = {
  responsibleName: "",
  email: "",
  phone: "",
  studentName: "",
  ageRange: fixedAgeRange,
  course: "",
  message: "",
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

function GradientButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-white transition sm:px-7 sm:tracking-[0.16em]"
    >
      {children}
      <ArrowRight size={17} weight="bold" aria-hidden="true" />
    </Link>
  );
}

function HeroVideo({ reduceMotion }: { reduceMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      if (!video.paused) return;

      void video.play().catch(() => {
        // Muted autoplay can still be blocked by some browser/device policies.
      });
    };

    playVideo();

    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    };

    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", playVideo);
    window.addEventListener("pageshow", playVideo);
    window.addEventListener("focus", playVideo);
    document.addEventListener("visibilitychange", resumeWhenVisible);

    return () => {
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
      window.removeEventListener("pageshow", playVideo);
      window.removeEventListener("focus", playVideo);
      document.removeEventListener("visibilitychange", resumeWhenVisible);
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Image
        src={site.heroPoster}
        alt=""
        fill
        priority
        className={`object-cover ${reduceMotion ? "opacity-100" : "opacity-0"}`}
        sizes="100vw"
      />
      {!reduceMotion ? (
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          src={site.heroVideo}
          poster={site.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,4,12,.95)_0%,rgba(13,7,18,.76)_42%,rgba(13,7,18,.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,4,12,.82)_0%,rgba(8,4,12,.28)_33%,transparent_64%)]" />
      <div className="absolute left-0 right-0 top-[9%] h-px bg-white/15" />
    </div>
  );
}

function EssenceCarousel({ reduceMotion }: { reduceMotion: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(carouselRef, { amount: 0.35 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const timer = window.setTimeout(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % essenceImages.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isInView, reduceMotion]);

  function showSlide(nextIndex: number) {
    if (nextIndex === activeIndex) return;

    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  }

  function moveSlide(step: -1 | 1) {
    setDirection(step);
    setActiveIndex(
      (current) =>
        (current + step + essenceImages.length) % essenceImages.length,
    );
  }

  const activeImage = essenceImages[activeIndex];

  return (
    <div
      ref={carouselRef}
      className="relative aspect-[4/4.35] overflow-hidden rounded-lg border border-mads-border shadow-[0_30px_80px_rgba(0,0,0,.35)] sm:aspect-[4/3.4]"
      aria-roledescription="carrossel"
      aria-label="Momentos de aulas e apresentações do Mads Project"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeImage.src}
          custom={direction}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: direction > 0 ? "7%" : "-7%", scale: 1.035 }
          }
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: direction > 0 ? "-5%" : "5%", scale: 0.985 }
          }
          transition={{ duration: reduceMotion ? 0.15 : 0.72, ease: madsEase }}
          className="absolute inset-0"
        >
          <Image
            src={activeImage.src}
            alt=""
            fill
            className="scale-110 object-cover opacity-45 blur-xl"
            style={{ objectPosition: activeImage.position }}
            sizes="(min-width: 1024px) 48vw, 100vw"
            aria-hidden="true"
          />
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-contain"
            style={{ objectPosition: activeImage.position }}
            sizes="(min-width: 1024px) 48vw, 100vw"
            priority={activeIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,4,12,.72)_0%,rgba(8,4,12,.14)_44%,transparent_68%)] sm:bg-[linear-gradient(0deg,rgba(8,4,12,.82)_0%,rgba(8,4,12,.18)_58%,transparent_78%)]" />

      <div className="absolute right-3 top-3 z-10 flex gap-2 sm:right-4 sm:top-4">
        <button
          type="button"
          onClick={() => moveSlide(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/36 text-white backdrop-blur-md transition hover:border-white/60 hover:bg-black/60 focus-visible:border-white sm:h-10 sm:w-10"
          aria-label="Ver imagem anterior"
        >
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => moveSlide(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/36 text-white backdrop-blur-md transition hover:border-white/60 hover:bg-black/60 focus-visible:border-white sm:h-10 sm:w-10"
          aria-label="Ver próxima imagem"
        >
          <CaretRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 rounded-lg border border-white/10 bg-black/24 p-2.5 text-white backdrop-blur-[6px] sm:bottom-5 sm:left-5 sm:right-5 sm:border-white/16 sm:bg-black/40 sm:p-5 sm:backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 sm:items-start sm:gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mads-accent-soft sm:text-[11px] sm:tracking-[0.22em]">
              Aprender fazendo
            </p>
            <p className="mt-2 hidden font-serif text-2xl font-semibold leading-tight sm:block">
              Técnica, afeto e palco no mesmo processo.
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-white/65 sm:pt-1 sm:text-xs">
            {String(activeIndex + 1).padStart(2, "0")} / {String(essenceImages.length).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 sm:mt-4 sm:gap-2" aria-label="Escolher imagem">
          {essenceImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => showSlide(index)}
              className="group flex h-3 flex-1 items-center sm:h-5"
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span
                className={`h-0.5 w-full rounded-full transition sm:h-1 ${
                  index === activeIndex
                    ? "bg-white"
                    : "bg-white/28 group-hover:bg-white/55"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PublicSite() {
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [values, setValues] = useState<EnrollmentForm>(emptyForm);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const reduceMotion = shouldReduceMotion ?? false;
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(values), [values]);

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

  function updateField<K extends keyof EnrollmentForm>(
    key: K,
    value: EnrollmentForm[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submitEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFallbackUrl(whatsappUrl);

    if (opened) {
      opened.opener = null;
    }
  }

  return (
    <main
      className="public-site relative overflow-hidden bg-mads-bg text-mads-text"
      data-theme={theme}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mads-grain" aria-hidden="true" />

      <header className="site-header fixed inset-x-0 top-0 z-50 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-11 lg:py-6">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={56}
              height={56}
              priority
              className="h-12 w-12 rounded-xl object-cover shadow-[0_6px_20px_rgba(123,92,240,.42)] lg:h-14 lg:w-14"
            />
            <span className="sr-only">Mads Project</span>
          </a>

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
                  className="text-[12px] font-bold uppercase tracking-[0.18em] text-mads-muted transition hover:text-mads-text"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#contato"
              className="mads-cta rounded-xl px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition"
            >
              Matricule-se
            </a>
            <button
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-mads-border bg-mads-surface text-mads-text transition hover:border-mads-accent hover:text-mads-accent"
              aria-label={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {theme === "dark" ? (
                <Sun size={17} weight="bold" />
              ) : (
                <Moon size={17} weight="bold" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-mads-border bg-mads-surface text-mads-text transition hover:border-mads-accent hover:text-mads-accent md:hidden"
              aria-label={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {theme === "dark" ? (
                <Sun size={17} weight="bold" />
              ) : (
                <Moon size={17} weight="bold" />
              )}
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-mads-border bg-mads-surface"
              onClick={() => setNavOpen((current) => !current)}
              aria-label="Abrir menu"
            >
              {navOpen ? (
                <X size={19} weight="bold" />
              ) : (
                <List size={19} weight="bold" />
              )}
            </button>
          </div>
        </nav>

        {navOpen ? (
          <div className="mx-5 mb-4 rounded-2xl border border-mads-border bg-mads-panel p-4 shadow-2xl xl:hidden">
            <div className="grid gap-2">
              {navLinks.map((link) =>
                link.external ? (
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
            </div>
          </div>
        ) : null}
      </header>

      <section
        id="inicio"
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        <HeroVideo reduceMotion={reduceMotion} />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col px-5 pb-10 pt-36 sm:block sm:min-h-0 sm:px-8 sm:pb-20 sm:pt-32 lg:px-11 xl:pb-14 xl:pt-28">
          <motion.div
            {...reveal}
            className="mb-4 max-w-full text-[10px] font-bold uppercase tracking-[0.16em] text-mads-accent-soft sm:mb-5 sm:text-[13px] sm:tracking-[0.3em]"
          >
            <span className="min-w-0">Escola de Teatro Musical</span>
          </motion.div>
          <h1 className="max-w-[1420px] font-serif text-[39px] font-bold leading-[.94] tracking-normal text-white min-[390px]:text-[44px] sm:text-[62px] md:text-[78px] lg:text-[96px] xl:text-[112px] 2xl:text-[118px]">
            <motion.span {...reveal} className="block">
              Desenvolvendo artistas.
            </motion.span>
            <motion.span
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.12 }}
              className="mads-gradient-text block font-semibold italic"
            >
              Formando pessoas.
            </motion.span>
          </h1>
          <motion.p
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.22 }}
            className="mt-6 hidden max-w-2xl text-lg font-light leading-8 text-white/78 sm:block sm:text-xl"
          >
            No Mads Project, crianças e jovens descobrem o poder da arte
            cantando, dançando e atuando com alegria, técnica e presença.
          </motion.p>
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.32 }}
            className="mt-auto flex max-w-[340px] flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <GradientButton href="#contato">Quero me matricular</GradientButton>
            <Link
              href={site.coursesUrl}
              className="hero-secondary-cta inline-flex items-center justify-center rounded-xl border px-6 py-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] transition sm:px-7 sm:tracking-[0.16em]"
            >
              Ver os cursos
            </Link>
          </motion.div>
        </div>
        <a
          href="#escola"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-[mads-bounce_2s_ease-in-out_infinite] text-white/70 sm:block"
          aria-label="Ir para A Escola"
        >
          <CaretDown size={28} weight="bold" />
        </a>
      </section>

      <section
        id="escola"
        className="anchor-section mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-11 lg:py-20"
      >
        <motion.div {...reveal} className="relative order-2 lg:order-1">
          <EssenceCarousel reduceMotion={reduceMotion} />
        </motion.div>
        <div className="order-1 lg:order-2">
          <motion.p
            {...reveal}
            className="mb-5 text-[13px] font-bold uppercase tracking-[0.3em] text-mads-accent-soft"
          >
            Nossa Essência
          </motion.p>
          <motion.h2
            {...reveal}
            className="font-serif text-[34px] font-semibold leading-[1.08] sm:text-[clamp(36px,4.6vw,60px)]"
          >
            Arte que desperta
            <br />
            <span className="mads-gradient-text italic">
              o melhor de cada criança
            </span>
          </motion.h2>
          <motion.div
            {...reveal}
            className="mt-6 flex max-w-xl flex-col gap-4 text-[16px] font-light leading-7 text-mads-muted sm:mt-7 sm:gap-5 sm:text-[17px] sm:leading-8"
          >
            {initialSchoolCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
          <motion.div {...reveal} className="mt-9">
            <a
              href="#orientadora"
              className="inline-flex items-center gap-3 rounded-xl border border-mads-border px-7 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-mads-accent transition hover:bg-mads-surface"
            >
              Saiba mais <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-mads-border bg-mads-surface">
        <div className="flex w-max animate-[mads-marquee_28s_linear_infinite]">
          {[0, 1].map((track) => (
            <div key={track} className="flex items-center py-6" aria-hidden={track === 1}>
              {marqueeItems.map((item) => (
                <div key={`${track}-${item}`} className="flex items-center">
                  <span className="px-8 text-[15px] font-semibold uppercase tracking-[0.35em] text-mads-muted sm:px-12">
                    {item}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-mads-accent" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section
        id="cursos"
        className="anchor-section mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-11 lg:py-20"
      >
        <div className="mb-10 grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <motion.p
              {...reveal}
              className="mb-4 text-[13px] font-bold uppercase tracking-[0.3em] text-mads-accent-soft"
            >
              O que você vai viver
            </motion.p>
            <motion.h2
              {...reveal}
              className="font-serif text-[clamp(38px,5vw,68px)] font-semibold leading-tight"
            >
              Teatro Musical
            </motion.h2>
          </div>
          <motion.p
            {...reveal}
            className="max-w-2xl text-[17px] font-light leading-8 text-mads-muted lg:justify-self-end"
          >
            Uma formação viva em que voz, corpo e cena se encontram em
            processos criativos que respeitam o ritmo de cada aluno.
          </motion.p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.article
                key={course.title}
                {...reveal}
                whileHover={reduceMotion ? undefined : { y: -8 }}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
                className="course-card group relative overflow-hidden rounded-lg border border-mads-border bg-mads-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,.18)] transition"
              >
                <div className="course-card-accent absolute inset-x-0 top-0 h-1 opacity-80" />
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-serif text-4xl font-semibold text-mads-text">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-mads-faint">
                      {course.eyebrow}
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-mads-border bg-mads-surface text-mads-accent">
                    <Icon size={24} weight="duotone" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-6 text-base font-light leading-7 text-mads-muted">
                  {course.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="mads-pill rounded-full border border-mads-border bg-mads-surface px-3 py-1.5 text-xs font-bold text-mads-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ul className="mt-7 grid gap-3 text-sm leading-6 text-mads-muted">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mads-accent" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
        <motion.div {...reveal} className="mt-10 flex justify-center">
          <GradientButton href={site.coursesUrl}>Ver todos os cursos</GradientButton>
        </motion.div>
      </section>

      <section
        id="orientadora"
        className="anchor-section mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.82fr] lg:gap-16 lg:px-11 lg:py-20"
      >
        <motion.div {...reveal}>
          <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.3em] text-mads-accent-soft">
            A Orientadora
          </p>
          <h2 className="mads-gradient-text mb-4 font-serif text-[clamp(48px,6vw,86px)] font-bold leading-none">
            Madona Andrade
          </h2>
          <p className="mb-8 text-[13px] font-bold uppercase tracking-[0.24em] text-mads-faint">
            Idealizadora e orientadora pedagógica
          </p>
          <blockquote className="border-l-2 border-mads-accent pl-7 font-serif text-[22px] font-normal italic leading-9 text-mads-text/88 md:text-2xl md:leading-10">
            &quot;{orientadoraQuote}&quot;
          </blockquote>
        </motion.div>
        <motion.div
          {...reveal}
          whileHover={reduceMotion ? undefined : { rotate: -1, scale: 1.015 }}
          className="relative"
        >
          <div className="visual-glow absolute -inset-3 rounded-2xl opacity-70 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-mads-border shadow-[0_26px_70px_rgba(0,0,0,.35)]">
            <Image
              src={site.orientadoraImage}
              alt="Retrato de Madona Andrade, idealizadora e orientadora pedagógica do Mads Project."
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,4,12,.5),transparent_55%)]" />
          </div>
        </motion.div>
      </section>

      <section
        id="contato"
        className="anchor-section mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-11 lg:py-20"
      >
        <motion.div {...reveal}>
          <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.3em] text-mads-accent-soft">
            Matrículas abertas
          </p>
          <h2 className="font-serif text-[clamp(38px,5vw,64px)] font-semibold leading-tight">
            Seu filho merece
            <br />
            <span className="italic">brilhar no palco</span>
          </h2>
          <p className="mt-6 max-w-lg text-[17px] font-light leading-8 text-mads-muted">
            Preencha o formulário e envie uma mensagem pronta pelo WhatsApp.
            Entraremos em contato para apresentar cursos, horários e valores.
          </p>
          <div className="mt-11 grid max-w-lg gap-6">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-mads-border text-mads-accent">
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-base text-mads-text sm:text-[17px]">
                      {item.value}
                    </span>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="flex items-center gap-5 transition hover:text-mads-accent"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className="flex items-center gap-5">
                  {content}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          {...reveal}
          className="rounded-lg border border-mads-border bg-mads-panel p-5 shadow-[0_24px_80px_rgba(0,0,0,.16)] sm:p-8 lg:p-10"
        >
          <form className="grid gap-6" onSubmit={submitEnrollment}>
            <div>
              <label className="mads-label" htmlFor="responsibleName">
                Nome do responsável
              </label>
              <input
                className="mads-field"
                id="responsibleName"
                required
                value={values.responsibleName}
                onChange={(event) =>
                  updateField("responsibleName", event.target.value)
                }
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="email">
                E-mail
              </label>
              <input
                className="mads-field"
                id="email"
                type="email"
                required
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="phone">
                Telefone / WhatsApp
              </label>
              <input
                className="mads-field"
                id="phone"
                required
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="(11) 00000-0000"
              />
            </div>
            <div>
              <label className="mads-label" htmlFor="studentName">
                Nome do aluno
              </label>
              <input
                className="mads-field"
                id="studentName"
                value={values.studentName}
                onChange={(event) =>
                  updateField("studentName", event.target.value)
                }
                placeholder="Nome da criança ou jovem"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mads-label" id="ageRangeLabel">
                  Faixa etária
                </p>
                <div
                  className="mads-field mads-static-field"
                  aria-labelledby="ageRangeLabel"
                  aria-describedby="ageRangeHint"
                >
                  {values.ageRange}
                </div>
                <p id="ageRangeHint" className="mt-2 text-xs text-mads-faint">
                  Turmas para crianças e jovens nessa faixa.
                </p>
              </div>
              <div>
                <label className="mads-label" htmlFor="course">
                  Curso
                </label>
                <select
                  className="mads-field mads-select"
                  id="course"
                  value={values.course}
                  onChange={(event) => updateField("course", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {interestCourses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mads-label" htmlFor="message">
                Mensagem opcional
              </label>
              <textarea
                className="mads-field min-h-28 resize-y"
                id="message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Alguma dúvida ou informação adicional?"
              />
            </div>
            <button
              type="submit"
              className="mads-cta inline-flex items-center justify-center gap-3 rounded-xl border-0 px-7 py-5 text-sm font-bold uppercase tracking-[0.16em] text-white transition"
            >
              Enviar <ArrowRight size={17} weight="bold" aria-hidden="true" />
            </button>
            {fallbackUrl ? (
              <p className="text-sm leading-6 text-mads-muted">
                Se o WhatsApp não abriu,{" "}
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-mads-accent underline underline-offset-4"
                >
                  clique aqui para continuar
                </a>
                .
              </p>
            ) : null}
          </form>
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
            href="#inicio"
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
