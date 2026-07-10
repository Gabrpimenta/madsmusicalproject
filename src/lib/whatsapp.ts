import { site } from "@/lib/site-content";

export type EnrollmentForm = {
  responsibleName: string;
  email: string;
  phone: string;
  studentName: string;
  ageRange: string;
  course: string;
  message: string;
};

export function buildEnrollmentMessage(values: EnrollmentForm) {
  const lines = [
    "Olá, Mads Project! Tenho interesse em uma matrícula.",
    "",
    `Responsável: ${values.responsibleName}`,
    `E-mail: ${values.email}`,
    `Telefone/WhatsApp: ${values.phone}`,
    `Aluno(a): ${values.studentName || "Não informado"}`,
    `Faixa etária: ${values.ageRange || "Não informada"}`,
    `Curso de interesse: ${values.course || "Não informado"}`,
  ];

  if (values.message.trim()) {
    lines.push("", `Mensagem: ${values.message.trim()}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(values: EnrollmentForm) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    buildEnrollmentMessage(values),
  )}`;
}
