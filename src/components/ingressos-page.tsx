"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Ticket,
} from "@phosphor-icons/react";
import { site } from "@/lib/site-content";

const pixKey = "65602923000169";

const sales = [
  {
    name: "Escola do Rock Bakhita",
    label: "Venda Bakhita",
    price: "R$ 45 por ingresso",
    message:
      "Olá! Quero comprar ingressos do espetáculo Escola do Rock pela venda da Escola do Rock Bakhita. Por favor, confirmem a disponibilidade e os detalhes da sessão.",
  },
  {
    name: "Escola do Rock Mads Project",
    label: "Venda Mads Project",
    price: "R$ 45 por ingresso",
    message:
      "Olá! Quero comprar ingressos do espetáculo Escola do Rock pela venda da Escola do Rock Mads Project. Por favor, confirmem a disponibilidade e os detalhes da sessão.",
  },
];

export function IngressosPage() {
  const [copied, setCopied] = useState(false);

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="public-site relative min-h-screen overflow-hidden bg-mads-bg text-mads-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_at_top,rgba(123,92,240,.24),transparent_68%)]"
      />

      <header className="relative z-10 border-b border-mads-border bg-mads-bg/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/#inicio" aria-label="Mads Project, página inicial">
            <Image
              src={site.logo}
              alt="Mads Project"
              width={52}
              height={52}
              className="h-12 w-12 rounded-xl object-cover"
              priority
            />
          </Link>
          <Link
            href="/#inicio"
            className="inline-flex items-center gap-2 rounded-full border border-mads-border px-4 py-2.5 text-sm font-semibold text-mads-muted transition hover:border-mads-accent hover:text-mads-text"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-mads-accent-soft">
            Ingressos · pagamento via Pix
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-7xl">
            <span className="mads-gradient-text">Escola do Rock</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mads-muted sm:text-lg">
            Escolha por qual venda deseja comprar. Cada equipe atende os pedidos
            e controla sua própria lista de ingressos.
          </p>
        </section>

        <section
          aria-labelledby="vendas-title"
          className="mt-14 grid gap-5 md:grid-cols-2"
        >
          <h2 id="vendas-title" className="sr-only">
            Escolha uma venda de ingressos
          </h2>
          {sales.map((sale, index) => (
            <article
              key={sale.name}
              className="flex flex-col rounded-3xl border border-mads-border bg-mads-panel p-6 shadow-[0_22px_80px_rgba(0,0,0,.16)] sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mads-accent/15 text-mads-accent-soft">
                  <Ticket size={25} weight="duotone" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-mads-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-mads-muted">
                  {sale.label}
                </span>
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                Venda 0{index + 1}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                {sale.name}
              </h3>
              <p className="mt-4 text-2xl font-semibold text-mads-accent-soft">
                {sale.price}
              </p>
              <p className="mt-3 flex-1 leading-relaxed text-mads-muted">
                Consulte a disponibilidade e os detalhes da sessão diretamente
                com esta equipe. O pagamento dos ingressos é feito somente por
                Pix.
              </p>
              <a
                href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(sale.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mads-cta mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.13em] text-white transition sm:text-sm"
              >
                Falar sobre esta venda
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-mads-border bg-mads-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                Chave Pix · CNPJ
              </p>
              <p className="mt-2 select-all font-mono text-xl font-semibold tracking-wide sm:text-2xl">
                {pixKey}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mads-muted">
                Confirme a disponibilidade com a equipe escolhida antes de
                pagar. Após o Pix, envie o comprovante na mesma conversa para
                registrar o pedido na venda correta.
              </p>
            </div>
            <button
              type="button"
              onClick={copyPixKey}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-mads-border px-5 py-3 text-sm font-bold text-mads-text transition hover:border-mads-accent hover:bg-mads-accent/10"
              aria-live="polite"
            >
              {copied ? (
                <>
                  <Check size={18} weight="bold" aria-hidden="true" />
                  Chave copiada
                </>
              ) : (
                <>
                  <Copy size={18} weight="bold" aria-hidden="true" />
                  Copiar chave Pix
                </>
              )}
            </button>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-mads-faint">
          As vendas Bakhita e Mads Project são atendidas separadamente. Faça o
          pagamento somente depois de confirmar a disponibilidade com a equipe
          responsável pelo seu pedido.
        </p>
      </div>
    </main>
  );
}
