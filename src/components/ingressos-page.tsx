"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarBlank,
  MapPin,
  Ticket,
} from "@phosphor-icons/react";
import { site } from "@/lib/site-content";

const showDate = "19 de novembro de 2026";
const venueAddress =
  "Av. Imperatriz Leopoldina, 550 – Vila Leopoldina, São Paulo – SP";
const venueMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

export function IngressosPage() {
  return (
    <main className="public-site relative min-h-screen overflow-hidden bg-mads-bg text-mads-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(123,92,240,.23),transparent_68%)]"
      />

      <header className="relative z-10 border-b border-mads-border bg-mads-bg/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/#inicio" aria-label="Mads Project, página inicial">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={48}
              height={48}
              className="h-11 w-11 rounded-xl object-cover"
              priority
            />
          </Link>
          <Link
            href="/#inicio"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-mads-border px-4 py-2 text-sm font-semibold text-mads-muted transition hover:border-mads-accent hover:text-mads-text"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <section className="grid items-center gap-8 lg:grid-cols-[1fr_.82fr] lg:gap-12">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-mads-accent-soft">
              Ingressos · Escola do Rock
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
              Uma noite de <span className="mads-gradient-text">rock</span>,
              música e teatro.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mads-muted sm:text-lg">
              As compras de ingresso são feitas somente presencialmente no
              Teatro UNICID.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-mads-border bg-mads-surface px-4 py-2.5 text-sm font-semibold">
                <CalendarBlank size={17} className="text-mads-accent-soft" aria-hidden="true" />
                {showDate}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-mads-border bg-mads-surface px-4 py-2.5 text-sm font-semibold">
                <Ticket size={17} className="text-mads-accent-soft" aria-hidden="true" />
                Ingressos à venda no teatro
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-mads-border bg-mads-panel p-7 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-8 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mads-accent-soft">
                Espetáculo musical
              </p>
              <p className="mt-6 font-serif text-5xl font-semibold leading-none sm:text-6xl">
                Escola
                <br />
                do Rock
              </p>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-mads-border pt-5">
                <div>
                  <p className="text-sm text-mads-muted">No teatro</p>
                  <p className="mt-1 text-lg font-semibold">Teatro UNICID</p>
                </div>
                <p className="rounded-full bg-mads-accent/15 px-4 py-2 text-sm font-bold text-mads-accent-soft">
                  300 lugares
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="ticket-sales-title"
          className="mt-12 rounded-3xl border border-mads-accent/50 bg-mads-accent/10 p-6 sm:p-9"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mads-accent/20 text-mads-accent-soft">
              <Ticket size={25} weight="fill" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                Aviso sobre a venda de ingressos
              </p>
              <h2
                id="ticket-sales-title"
                className="mt-2 font-serif text-3xl font-semibold sm:text-4xl"
              >
                Compras somente no teatro
              </h2>
              <div className="mt-3 space-y-1 text-base leading-relaxed sm:text-lg">
                <p className="font-semibold text-mads-text">
                  As vendas pelo site estão encerradas.
                </p>
                <p className="text-mads-muted">
                  Compre seu ingresso presencialmente no Teatro&nbsp;UNICID.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-mads-border bg-mads-surface p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
            Local de compra e do espetáculo
          </p>
          <h2 className="mt-2 font-semibold">Teatro UNICID</h2>
          <p className="mt-3 flex gap-2 text-sm leading-relaxed text-mads-muted sm:text-base">
            <MapPin size={19} className="mt-0.5 shrink-0 text-mads-accent-soft" aria-hidden="true" />
            {venueAddress}
          </p>
          <a
            href={venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-mads-border px-4 py-2 text-sm font-bold text-mads-accent-soft transition hover:border-mads-accent hover:bg-mads-accent/10 hover:text-mads-text"
          >
            Ver localização no mapa
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
