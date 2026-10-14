"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  Check,
  Clock,
  Copy,
  MapPin,
  Minus,
  Plus,
  Ticket,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { site } from "@/lib/site-content";

const pixKey = "65602923000169";
const ticketPrice = 45;
const showDate = "19/11/2026";
const venueAddress =
  "Av. Imperatriz Leopoldina, 550 – Vila Leopoldina, São Paulo – SP";
const pickupAddress = site.address;
const venueMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

const sales = [
  {
    id: "bakhita",
    name: "Escola do Rock Bakhita",
    label: "Venda Bakhita",
    schedule: "Horário a confirmar",
  },
  {
    id: "mads",
    name: "Escola do Rock Mads Project",
    label: "Venda Mads Project",
    schedule: "Horário a confirmar",
  },
] as const;

type CopyState = "idle" | "copied" | "failed";

export function IngressosPage() {
  const [copied, setCopied] = useState<CopyState>("idle");
  const [buyerName, setBuyerName] = useState("");
  const [ticketNames, setTicketNames] = useState("");
  const [saleId, setSaleId] = useState<(typeof sales)[number]["id"]>("bakhita");
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const sale = sales.find((item) => item.id === saleId) ?? sales[0];
  const total = ticketPrice * quantity;

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
  }

  function openWhatsApp(message: string) {
    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function checkAvailability() {
    const message = [
      "Olá, Mads Project! Quero consultar a disponibilidade de ingressos para o espetáculo Escola do Rock.",
      "",
      `Responsável: ${buyerName.trim()}`,
      `Ingressos para: ${ticketNames.trim()}`,
      `Venda: ${sale.name}`,
      `Data: ${showDate}`,
      `Horário: ${sale.schedule}`,
      `Quantidade desejada: ${quantity} ingresso(s)`,
      `Valor: ${formatPrice(ticketPrice)} por ingresso · Total: ${formatPrice(total)}`,
      "",
      "Por favor, confirmem as vagas antes de eu realizar o Pix.",
    ].join("\n");

    openWhatsApp(message);
  }

  function sendReceipt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) return;

    const message = [
      "Olá, Mads Project! Já fiz o Pix dos ingressos do espetáculo Escola do Rock.",
      "",
      `Responsável: ${buyerName.trim()}`,
      `Ingressos para: ${ticketNames.trim()}`,
      `Venda: ${sale.name}`,
      `Data: ${showDate}`,
      `Horário: ${sale.schedule}`,
      `Quantidade: ${quantity} ingresso(s)`,
      `Valor total: ${formatPrice(total)}`,
      "",
      "Vou anexar o comprovante de pagamento nesta conversa.",
      `Retirada dos ingressos: escola Mads Project, ${pickupAddress}`,
    ].join("\n");

    openWhatsApp(message);
  }

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
              Garanta seus ingressos pelo Pix. Consulte as vagas pelo WhatsApp,
              pague depois da confirmação e retire os ingressos na escola.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-mads-border bg-mads-surface px-4 py-2.5 text-sm font-semibold">
                <CalendarBlank size={17} className="text-mads-accent-soft" aria-hidden="true" />
                19 de novembro de 2026
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-mads-border bg-mads-surface px-4 py-2.5 text-sm font-semibold">
                <Ticket size={17} className="text-mads-accent-soft" aria-hidden="true" />
                {formatPrice(ticketPrice)} por ingresso
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
                  <p className="mt-1 text-lg font-semibold">Vila Leopoldina</p>
                </div>
                <p className="rounded-full bg-mads-accent/15 px-4 py-2 text-sm font-bold text-mads-accent-soft">
                  300 lugares
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="sales-title" className="mt-14">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                1 · Escolha sua venda
              </p>
              <h2 id="sales-title" className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Por qual grupo vai comprar?
              </h2>
            </div>
            <p className="text-sm text-mads-muted">Selecione uma opção para montar o pedido.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sales.map((item) => {
              const selected = item.id === saleId;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSaleId(item.id)}
                  className={`rounded-2xl border p-5 text-left transition sm:p-6 ${
                    selected
                      ? "border-mads-accent bg-mads-accent/10 shadow-[0_12px_38px_rgba(123,92,240,.12)]"
                      : "border-mads-border bg-mads-panel hover:border-mads-accent/60"
                  }`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-mads-accent-soft">
                        {item.label}
                      </span>
                      <span className="mt-2 block font-serif text-2xl font-semibold">
                        {item.name}
                      </span>
                      <span className="mt-2 block text-sm text-mads-muted">
                        {formatPrice(ticketPrice)} por ingresso · {item.schedule}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-mads-accent bg-mads-accent text-white"
                          : "border-mads-border text-transparent"
                      }`}
                    >
                      <Check size={14} weight="bold" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid items-start gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <form
            id="receipt-form"
            onSubmit={sendReceipt}
            className="rounded-3xl border border-mads-border bg-mads-panel p-5 sm:p-7"
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                2 · Monte seu pedido
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Seus ingressos
              </h2>
              <p className="mt-1 text-sm text-mads-muted">Venda: {sale.name}</p>
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
              className="min-h-12 w-full rounded-xl border border-mads-border bg-mads-bg px-4 py-3 text-mads-text placeholder:text-mads-faint focus:border-mads-accent focus:outline-none"
              placeholder="Nome e sobrenome"
            />

            <label className="mb-2 mt-5 block text-sm font-semibold" htmlFor="ticket-names">
              Para quem são os ingressos?
            </label>
            <input
              id="ticket-names"
              name="ticketNames"
              required
              value={ticketNames}
              onChange={(event) => setTicketNames(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-mads-border bg-mads-bg px-4 py-3 text-mads-text placeholder:text-mads-faint focus:border-mads-accent focus:outline-none"
              placeholder="Informe o nome de cada pessoa"
              aria-describedby="ticket-names-help"
            />
            <p id="ticket-names-help" className="mt-2 text-xs leading-relaxed text-mads-faint">
              Se comprar mais de um, informe todos os nomes. Eles também irão na mensagem do WhatsApp.
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Quantidade</p>
                <p className="mt-1 text-xs text-mads-muted">
                  {formatPrice(ticketPrice)} cada
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-mads-border bg-mads-bg p-1.5">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-mads-muted transition hover:bg-mads-surface hover:text-mads-text disabled:opacity-35"
                >
                  <Minus size={18} weight="bold" aria-hidden="true" />
                </button>
                <output
                  className="min-w-8 text-center text-lg font-bold"
                  aria-live="polite"
                  aria-label={`${quantity} ingressos`}
                >
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  disabled={quantity >= 300}
                  onClick={() => setQuantity((current) => Math.min(300, current + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-mads-muted transition hover:bg-mads-surface hover:text-mads-text disabled:opacity-35"
                >
                  <Plus size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-mads-accent/10 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4 text-sm text-mads-muted">
                <span>{quantity} × {formatPrice(ticketPrice)}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4 border-t border-mads-border pt-4">
                <span className="font-semibold">Total do Pix</span>
                <span className="text-3xl font-bold text-mads-accent-soft" aria-live="polite">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3 rounded-xl border border-mads-border p-4">
              <Clock size={20} className="mt-0.5 shrink-0 text-mads-accent-soft" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-mads-muted">
                Os horários das apresentações serão divulgados assim que estiverem confirmados.
              </p>
            </div>
          </form>

          <div className="flex flex-col gap-5">
            <section className="rounded-3xl border border-mads-border bg-mads-panel p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
                3 · Pague com Pix
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">Use a chave Pix</h2>
              <p className="mt-2 text-sm leading-relaxed text-mads-muted">
                Siga as etapas abaixo. No aplicativo do seu banco, escolha Pix por CNPJ e confira o total do pedido.
              </p>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-mads-border bg-mads-bg p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-mads-muted">
                    Chave Pix · CNPJ
                  </p>
                  <p className="mt-1 select-all font-mono text-xl font-semibold tracking-wide">
                    {pixKey}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyPixKey}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-mads-border px-4 py-2.5 text-sm font-bold transition hover:border-mads-accent hover:bg-mads-accent/10"
                  aria-live="polite"
                >
                  {copied === "copied" ? (
                    <>
                      <Check size={17} weight="bold" aria-hidden="true" />
                      Copiada
                    </>
                  ) : (
                    <>
                      <Copy size={17} weight="bold" aria-hidden="true" />
                      Copiar chave
                    </>
                  )}
                </button>
              </div>
              {copied === "failed" ? (
                <p role="status" className="mt-2 text-sm text-mads-accent-soft">
                  Não foi possível copiar automaticamente. Selecione a chave acima e copie.
                </p>
              ) : null}

              <div className="mt-5 rounded-2xl border border-mads-border bg-mads-bg/70 p-4 sm:p-5">
                <h3 className="text-sm font-bold">Como concluir a compra</h3>
                <ol className="mt-3 space-y-2 text-sm leading-relaxed text-mads-muted">
                  <li>1. Consulte as vagas com a equipe pelo WhatsApp.</li>
                  <li>2. Após a confirmação, faça o Pix no valor total acima.</li>
                  <li>3. Envie o comprovante e confirme os nomes de quem receberá os ingressos.</li>
                  <li>4. Retire os ingressos na escola Mads Project.</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={checkAvailability}
                disabled={!buyerName.trim() || !ticketNames.trim()}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-mads-border px-4 py-3 text-center text-sm font-bold transition hover:border-mads-accent hover:bg-mads-accent/10 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <WhatsappLogo size={19} weight="fill" aria-hidden="true" />
                Consultar disponibilidade antes de pagar
              </button>
              <p className="mt-2 text-xs leading-relaxed text-mads-faint">
                A capacidade total do teatro é de 300 pessoas, compartilhada entre as duas vendas. Confirme as vagas antes de pagar.
              </p>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-mads-border p-4 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-500"
                />
                <span>Confirmei as vagas com a equipe e já paguei o total acima.</span>
              </label>
              <button
                type="submit"
                form="receipt-form"
                disabled={!confirmed || !buyerName.trim() || !ticketNames.trim()}
                className="mads-cta mt-4 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-white transition sm:text-sm disabled:cursor-not-allowed disabled:opacity-45"
              >
                Enviar comprovante pelo WhatsApp
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </button>
              <p className="mt-3 text-xs leading-relaxed text-mads-faint">
                O WhatsApp abre com o resumo do pedido. Anexe o comprovante na conversa e envie a mensagem.
              </p>
            </section>

          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-mads-border bg-mads-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
              Local do espetáculo
            </p>
            <p className="mt-2 font-semibold">Teatro · 19 de novembro de 2026</p>
            <p className="mt-2 flex gap-2 text-sm leading-relaxed text-mads-muted">
              <MapPin size={19} className="mt-0.5 shrink-0 text-mads-accent-soft" aria-hidden="true" />
              {venueAddress}
            </p>
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-mads-accent-soft hover:text-mads-text"
            >
              Abrir mapa
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </article>
          <article className="rounded-2xl border border-mads-border bg-mads-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mads-accent-soft">
              Retirada dos ingressos
            </p>
            <h2 className="mt-2 font-semibold">Escola Mads Project</h2>
            <p className="mt-2 flex gap-2 text-sm leading-relaxed text-mads-muted">
              <MapPin size={19} className="mt-0.5 shrink-0 text-mads-accent-soft" aria-hidden="true" />
              {pickupAddress}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-mads-faint">
              A equipe confirma o pagamento pelo WhatsApp. Os ingressos são retirados presencialmente na escola.
            </p>
          </article>
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-mads-faint">
          As vendas Bakhita e Mads Project são contabilizadas separadamente e compartilham a capacidade total do teatro. A disponibilidade é confirmada pela equipe no WhatsApp.
        </p>
      </div>

    </main>
  );
}
