"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  MapPin,
  Ticket,
} from "@phosphor-icons/react";
import { site } from "@/lib/site-content";

const pixKey = "65602923000169";
const ticketPrice = 45;
const showDate = "19/11/2026";
const pickupAddress = site.address;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(amount);

const sales = [
  {
    name: "Escola do Rock Bakhita",
    label: "Venda Bakhita",
    schedule: "Horário a confirmar",
  },
  {
    name: "Escola do Rock Mads Project",
    label: "Venda Mads Project",
    schedule: "Horário a confirmar",
  },
];

export function IngressosPage() {
  const [copied, setCopied] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [saleIndex, setSaleIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const total = ticketPrice * quantity;

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function sendReceiptToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const sale = sales[saleIndex];
    const message = [
      "Olá, Mads Project! Já fiz o Pix dos ingressos do espetáculo Escola do Rock e vou enviar o comprovante.",
      "",
      `Responsável: ${buyerName.trim()}`,
      `Venda: ${sale.name}`,
      `Data: ${showDate}`,
      `Horário: ${sale.schedule}`,
      `Quantidade: ${quantity} ingresso(s)`,
      `Valor total: ${formatPrice(total)}`,
      "",
      "Segue o comprovante de pagamento em anexo.",
      `Vou retirar os ingressos na escola: ${pickupAddress}`,
    ].join("\n");

    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
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
            Compre seu ingresso por Pix, envie o comprovante pelo WhatsApp do
            Mads Project e retire o ingresso na escola.
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
                {formatPrice(ticketPrice)} por ingresso
              </p>
              <p className="mt-3 flex-1 leading-relaxed text-mads-muted">
                {showDate} · {sale.schedule}. Pagamento somente por Pix. Esta
                opção identifica a venda que será contabilizada no seu pedido.
              </p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-[1fr_1fr]">
          <form
            onSubmit={sendReceiptToWhatsApp}
            className="rounded-3xl border border-mads-border bg-mads-panel p-6 sm:p-8"
          >
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                1 · Dados do pedido
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Calcule seu total
              </h2>
            </div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="buyer-name">
              Nome do responsável
            </label>
            <input
              id="buyer-name"
              name="buyerName"
              autoComplete="name"
              required
              value={buyerName}
              onChange={(event) => setBuyerName(event.target.value)}
              className="mb-5 min-h-12 w-full rounded-xl border border-mads-border bg-mads-bg px-4 py-3 text-mads-text placeholder:text-mads-faint"
              placeholder="Nome e sobrenome"
            />

            <label className="mb-2 block text-sm font-semibold" htmlFor="ticket-sale">
              Venda dos ingressos
            </label>
            <select
              id="ticket-sale"
              name="sale"
              value={saleIndex}
              onChange={(event) => setSaleIndex(Number(event.target.value))}
              className="mb-5 min-h-12 w-full rounded-xl border border-mads-border bg-mads-bg px-4 py-3 text-mads-text"
            >
              {sales.map((sale, index) => (
                <option key={sale.name} value={index}>
                  {sale.name}
                </option>
              ))}
            </select>

            <label className="mb-2 block text-sm font-semibold" htmlFor="ticket-quantity">
              Quantidade de ingressos
            </label>
            <input
              id="ticket-quantity"
              name="quantity"
              type="number"
              min={1}
              step={1}
              required
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value) || 1))
              }
              className="min-h-12 w-full rounded-xl border border-mads-border bg-mads-bg px-4 py-3 text-mads-text"
            />

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-mads-accent/10 px-4 py-4">
              <span className="font-semibold text-mads-muted">Total via Pix</span>
              <span className="text-2xl font-bold text-mads-accent-soft" aria-live="polite">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              className="mads-cta mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.13em] text-white transition sm:text-sm"
            >
              Já paguei · enviar comprovante
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </button>
            <p className="mt-3 text-xs leading-relaxed text-mads-faint">
              O WhatsApp abrirá com os dados do pedido. Anexe o comprovante na
              conversa antes de enviar a mensagem.
            </p>
          </form>

          <div className="flex flex-col gap-5">
            <section className="rounded-3xl border border-mads-border bg-mads-surface p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                  2 · Pagamento
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold">
                  Pague com Pix
                </h2>
                <p className="mt-2 text-sm text-mads-muted">
                  Confira o total do pedido e use esta chave Pix CNPJ.
                </p>
              </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                Chave Pix · CNPJ
              </p>
              <p className="mt-2 select-all font-mono text-xl font-semibold tracking-wide sm:text-2xl">
                {pixKey}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mads-muted">
                Após pagar, use o botão do pedido para abrir o WhatsApp do Mads
                Project e anexe o comprovante para registrar a venda escolhida.
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
            </section>

            <section className="rounded-3xl border border-mads-border bg-mads-surface p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                3 · Retirada
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Retire na escola
              </h2>
              <p className="mt-3 flex gap-2 text-sm leading-relaxed text-mads-muted">
                <MapPin size={20} className="mt-0.5 shrink-0 text-mads-accent-soft" aria-hidden="true" />
                {pickupAddress}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mads-muted">
                A equipe confirmará o pagamento pelo WhatsApp. Os ingressos
                serão retirados presencialmente na escola.
              </p>
            </section>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-mads-faint">
          As vendas Bakhita e Mads Project são contabilizadas separadamente. O
          pagamento e a confirmação do comprovante são feitos manualmente pela
          equipe do Mads Project.
        </p>
      </div>
    </main>
  );
}
