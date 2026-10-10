import type { Icon } from "@phosphor-icons/react";
import {
  CalendarCheck,
  CalendarDots,
  ChartBar,
  EnvelopeSimple,
  InstagramLogo,
  MapPin,
  MaskHappy,
  MicrophoneStage,
  PersonSimpleTaiChi,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";

export const siteBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function withBasePath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${siteBasePath}${path}`;
}

export const site = {
  name: "Mads Project",
  title: "Mads Project | Escola de Teatro Musical em São Paulo",
  description:
    "Escola de teatro musical para crianças e jovens em São Paulo, com formação em canto, teatro e dança.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://madsmusical.com.br",
  logo: withBasePath("/assets/mads-logo.jpeg"),
  heroVideo: withBasePath("/assets/media/hero-stage-loop-web.mp4"),
  heroPoster: withBasePath("/assets/media/hero-stage-poster.jpg"),
  orientadoraImage: withBasePath("/assets/madona-perfil.jpeg"),
  whatsappNumber: "5511961739191",
  whatsappDisplay: "+55 (11) 96173-9191",
  email: "madsmusicalproject@gmail.com",
  instagram: "https://instagram.com/madsmusicalproject",
  instagramHandle: "@madsmusicalproject",
  address: "Rua Tonelero, 938 - Vila Ipojuca, São Paulo - SP, 05056-001",
  coursesUrl: "/cursos/",
  teachersUrl: "/professores/",
};

export const essenceImages = [
  {
    src: withBasePath("/assets/aprender-fazendo/01-main.jpeg"),
    alt: "Alunas em cena durante uma apresentação do Mads Project.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/02-palco.jpeg"),
    alt: "Dois alunos interpretando personagens no palco.",
    position: "center 12%",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/03-palco.jpeg"),
    alt: "Grupo de alunas atuando em uma cena teatral.",
    position: "center 48%",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/04-ensaio.jpeg"),
    alt: "Alunos ensaiando em sala antes da apresentação.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/05-palco.jpeg"),
    alt: "Três alunas interpretando juntas no palco.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/06-palco.jpeg"),
    alt: "Alunas em uma cena musical com balanço no palco.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/07-palco.jpeg"),
    alt: "Quatro estudantes em uma apresentação de teatro musical.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/08-palco.jpeg"),
    alt: "Estudantes interpretando uma cena de laboratório no palco.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/09-palco.jpeg"),
    alt: "Aluna atuando em um balanço durante o espetáculo.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/10-roda-criativa.jpeg"),
    alt: "Professor conduzindo uma atividade em roda com os alunos do Mads Project.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/11-turma-reunida.jpeg"),
    alt: "Turma e professores reunidos em um momento descontraído no estúdio.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/12-certificados.jpeg"),
    alt: "Alunos e professor celebrando a entrega de certificados.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/13-celebracao.jpeg"),
    alt: "Turma celebrando em conjunto após uma atividade artística.",
    position: "center",
  },
  {
    src: withBasePath("/assets/aprender-fazendo/14-processo-em-roda.jpeg"),
    alt: "Professor e estudantes conversando em roda durante uma aula.",
    position: "center",
  },
] as const;

export const navLinks: Array<{
  label: string;
  href: string;
  external?: boolean;
}> = [
  { label: "Início", href: "/#inicio" },
  { label: "A Escola", href: "/#escola" },
  { label: "Cursos", href: site.coursesUrl },
  { label: "Professores", href: site.teachersUrl },
  { label: "Ingressos", href: "/ingressos/" },
  { label: "Orientadora", href: "/#orientadora" },
  { label: "Contato", href: "/#contato" },
];

export const courses = [
  {
    title: "Canto",
    icon: MicrophoneStage,
    eyebrow: "Voz, repertório e interpretação",
    description:
      "Desenvolvimento vocal com técnica e expressão. Do teatro musical ao repertório contemporâneo, cada aluno aprende a cantar com presença, escuta e segurança.",
    tags: ["Técnica vocal", "Repertório", "Presença"],
    outcomes: ["Respiração e afinação", "Interpretação musical", "Confiança para se apresentar"],
  },
  {
    title: "Teatro",
    icon: MaskHappy,
    eyebrow: "Cena, criatividade e comunicação",
    description:
      "Muito além da interpretação: jogos teatrais, improvisação e construção de personagens desenvolvem criatividade, comunicação e inteligência emocional.",
    tags: ["Improvisação", "Personagem", "Comunicação"],
    outcomes: ["Expressão corporal", "Trabalho em equipe", "Autonomia em cena"],
  },
  {
    title: "Dança",
    icon: PersonSimpleTaiChi,
    eyebrow: "Movimento, ritmo e musicalidade",
    description:
      "Movimento com técnica e personalidade. Jazz Musical, Street Dance e preparação corporal desenvolvem coordenação, ritmo e expressão artística.",
    tags: ["Jazz Musical", "Street Dance", "Corpo cênico"],
    outcomes: ["Coordenação e ritmo", "Consciência corporal", "Energia para o palco"],
  },
];

export const coursePrograms = [
  {
    id: "teatro-musical",
    title: "Teatro Musical",
    eyebrow: "Interpretação, canto e dança",
    icon: MaskHappy,
    summary:
      "Uma formação artística completa, dinâmica e acolhedora, na qual cada aluno vivencia todas as etapas da construção de um espetáculo musical.",
    paragraphs: [
      "Com duração de fevereiro a dezembro, o curso culmina em uma grande apresentação no final do ano, quando os alunos colocam em prática tudo o que desenvolveram. As matrículas para novas turmas acontecem no mês de janeiro.",
      "Ao longo das aulas, são trabalhadas interpretação, expressão corporal, preparação vocal, musicalidade, consciência corporal e montagem de cenas, respeitando a faixa etária e o nível de cada turma. Além do desenvolvimento técnico, os alunos fortalecem criatividade, comunicação, disciplina, trabalho em equipe e autoconfiança.",
      "Os estudantes também participam de workshops e bate-papos com artistas e profissionais do teatro musical, ampliando seu contato com o mercado e conhecendo diferentes trajetórias dentro da área artística.",
      "O curso inclui vivências em figurino, maquiagem e cenografia, permitindo que os alunos compreendam o processo criativo dos bastidores e valorizem cada profissional envolvido na realização de um musical.",
      "Mais do que formar artistas, o curso desenvolve indivíduos criativos, confiantes e capazes de se expressar com liberdade, sensibilidade e segurança, valorizando a individualidade de cada aluno.",
    ],
    tags: ["Interpretação", "Canto", "Dança", "Figurino", "Maquiagem", "Cenografia"],
    facts: [
      { label: "Fevereiro a dezembro", icon: CalendarDots },
      { label: "Matrículas em janeiro", icon: CalendarCheck },
    ],
    media: {
      src: withBasePath("/assets/cursos/teatro-musical.mp4"),
      poster: withBasePath("/assets/cursos/teatro-musical-poster.jpg"),
      label: "Trecho de uma aula de Teatro Musical",
      orientation: "portrait",
    },
    objectives: [
      "Desenvolver habilidades em interpretação, canto e dança",
      "Aprimorar expressão corporal, vocal e artística",
      "Estimular criatividade, imaginação e comunicação",
      "Fortalecer autoconfiança, disciplina e trabalho em equipe",
      "Desenvolver presença de palco e interpretação cênica",
      "Vivenciar todas as etapas da criação de um espetáculo musical",
      "Preparar os alunos para apresentações e produções artísticas",
    ],
  },
  {
    id: "street-dance",
    title: "Street Dance",
    eyebrow: "Ritmo, identidade e movimento",
    icon: PersonSimpleTaiChi,
    summary:
      "Uma formação em danças urbanas que desenvolve ritmo, coordenação motora, musicalidade, consciência corporal e expressão artística.",
    paragraphs: [
      "Durante as aulas, são explorados diferentes estilos das danças urbanas, como Hip Hop, House, Locking, Popping e elementos do Freestyle, sempre respeitando o nível e a faixa etária de cada turma.",
      "Além da técnica, os alunos são incentivados a desenvolver criatividade, improvisação, confiança e presença de palco por meio de exercícios, dinâmicas e montagens coreográficas. O trabalho também estimula disciplina, trabalho em equipe, respeito e autonomia, proporcionando uma formação artística completa em um ambiente acolhedor e motivador.",
    ],
    tags: ["Hip Hop", "House", "Locking", "Popping", "Freestyle"],
    facts: [
      { label: "Diferentes níveis", icon: ChartBar },
      { label: "Turmas por faixa etária", icon: UsersThree },
    ],
    media: {
      src: withBasePath("/assets/cursos/street-dance.mp4"),
      poster: withBasePath("/assets/cursos/street-dance-poster-v2.jpg"),
      label: "Trecho de uma aula de Street Dance",
      orientation: "landscape",
    },
    objectives: [
      "Desenvolver coordenação motora e consciência corporal",
      "Aprimorar ritmo e musicalidade",
      "Estimular criatividade e improvisação",
      "Trabalhar expressão corporal e presença de palco",
      "Desenvolver disciplina e trabalho em equipe",
      "Preparar os alunos para apresentações e espetáculos",
    ],
  },
  {
    id: "k-pop",
    title: "K-pop",
    eyebrow: "Coreografia, precisão e performance",
    icon: MicrophoneStage,
    summary:
      "Para alunos que desejam desenvolver técnica, performance e expressão artística por meio das coreografias dos principais grupos da música pop sul-coreana.",
    paragraphs: [
      "Durante as aulas, os alunos trabalham coordenação motora, consciência corporal, musicalidade, precisão dos movimentos e presença de palco, explorando diferentes estilos presentes no universo do K-pop. As atividades incluem exercícios técnicos, montagens coreográficas e dinâmicas que estimulam criatividade, memória, trabalho em equipe e confiança.",
      "Além do aprendizado das coreografias, o curso incentiva o desenvolvimento da interpretação, da postura artística e da conexão com o público, proporcionando uma experiência completa e divertida para alunos de diferentes níveis.",
    ],
    tags: ["Coreografia", "Performance", "Musicalidade", "Expressão"],
    facts: [
      { label: "Diferentes níveis", icon: ChartBar },
      { label: "Performance em grupo", icon: UsersThree },
    ],
    media: {
      src: withBasePath("/assets/cursos/kpop.mp4"),
      poster: withBasePath("/assets/cursos/kpop-poster-v2.jpg"),
      label: "Trecho de uma aula de K-pop",
      orientation: "portrait",
    },
    objectives: [
      "Desenvolver coordenação motora e consciência corporal",
      "Aprimorar ritmo, musicalidade e precisão dos movimentos",
      "Trabalhar expressão corporal e presença de palco",
      "Estimular disciplina, concentração e trabalho em equipe",
      "Desenvolver confiança e performance artística",
      "Preparar os alunos para apresentações e espetáculos",
    ],
  },
] as const;

export const contactItems: Array<{
  label: string;
  value: string;
  href?: string;
  icon: Icon;
}> = [
  {
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: `https://wa.me/${site.whatsappNumber}`,
    icon: WhatsappLogo,
  },
  {
    label: "E-mail",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: EnvelopeSimple,
  },
  {
    label: "Endereço",
    value: site.address,
    icon: MapPin,
  },
  {
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
    icon: InstagramLogo,
  },
];

export const teacherProfiles = [
  {
    name: "Madona Andrade",
    role: "Musical e Street Dance",
    image: withBasePath("/assets/professores/madona-andrade.jpeg"),
    imagePosition: "center 22%",
    specialties: ["Dança", "Teatro musical", "Pedagogia"],
    bio: [
      "Atriz, bailarina e arte-educadora. Iniciou seus estudos na Casa de Teatro de Porto Alegre aos 15 anos e, em 2014, mudou-se para São Paulo, onde se apaixonou pela dança e pelo teatro musical. Aprofundou-se no ballet clássico, danças urbanas e fez parte de grupos renomados como MGDMfam e Woop'z.",
      "Criou o projeto Move em 2016, levando arte para comunidades carentes, e atuou como monitora na Associação Espaço Curumim. Em 2025, fundou a Mads Musical Project, um curso inovador de teatro musical para crianças e adolescentes, combinando arte, criatividade e desenvolvimento pessoal.",
      "Sua abordagem pedagógica é única: com um olhar sensível e atento, Madona não apenas ensina, mas inspira. Seu método valoriza tanto o crescimento individual quanto a conexão coletiva, criando um ambiente onde cada aluno se sente visto, encorajado e livre para explorar seu potencial artístico.",
    ],
  },
  {
    name: "Natália Cunha",
    role: "Street Dance",
    image: withBasePath("/assets/professores/natalia-cunha.jpg"),
    imagePosition: "center 28%",
    specialties: ["Street Dance", "Waacking", "Danças urbanas"],
    bio: [
      "Natália Cunha é professora de Street Dance, artista da dança, educadora social e produtora cultural. Atua com as Danças Urbanas há mais de 15 anos, tendo no Waacking sua principal linha de pesquisa e desenvolvimento artístico.",
      "Ao longo de sua trajetória, ministrou aulas, oficinas e workshops em escolas, projetos sociais, centros culturais e festivais, trabalhando com crianças, adolescentes e adultos. Também participa de projetos culturais, apresentações, competições, videoclipes e campanhas, sempre promovendo o acesso à arte e à cultura.",
      "No MADS Project Musical, conduz as aulas de Street Dance, apresentando aos alunos diferentes linguagens das Danças Urbanas por meio de exercícios de musicalidade, criação, improvisação e expressão corporal. Suas aulas estimulam a criatividade, a presença cênica, o trabalho em equipe e a confiança, em um ambiente acolhedor e respeitoso.",
      "Natália acredita na dança como uma poderosa ferramenta de transformação, capaz de fortalecer a autoestima, a autonomia, a sensibilidade e o desenvolvimento artístico e humano de cada aluno.",
    ],
  },
  {
    name: "Giovanna Federzoni",
    role: "Teatro",
    image: withBasePath("/assets/professores/giovanna-federzoni.jpeg"),
    imagePosition: "center 24%",
    specialties: ["Interpretação", "Corpo", "Cena"],
    bio: [
      "Atriz, performer e arte-educadora, graduada em Comunicação das Artes do Corpo pela PUC-SP e formada em Teatro Musical pela 4 Act Performing Arts.",
      "Desenvolveu pesquisas em teatro Nô entre 2015 e 2019 e foi cofundadora do Coletivo Nuvem, contemplado pelos programas VAI 1 e PROAC. Atuou como assistente de direção, preparadora corporal e produtora em projetos do grupo A Motosserra Perfumada.",
      "Integra montagens de teatro musical e infantil por companhias como Cia Singulari, Cia Vila Teatro e Grupo Trapiche. Em 2024, interpretou Chiquinha em \"O Circo Mágico do Chaves\" e, em 2025, integrou produções do grupo Cemitério de Automóveis.",
    ],
  },
  {
    name: "Verônica Andreazze",
    role: "K-pop e Danças Urbanas",
    image: withBasePath("/assets/professores/veronica-andreazze.jpg"),
    imagePosition: "center 30%",
    specialties: ["K-pop", "Danças urbanas", "Coreografia"],
    bio: [
      "Verônica Andreazze é professora de K-pop e Danças Urbanas, licenciada em Artes Visuais pela Universidade Federal do Rio Grande do Norte (UFRN). Atua como dançarina e educadora há mais de seis anos, unindo experiência artística, didática e formação contínua.",
      "Ao longo de sua trajetória, ministrou aulas, workshops e participou de festivais e projetos culturais em diferentes estados do Brasil. Também desenvolve trabalhos como coreógrafa e bailarina em videoclipes, apresentações e eventos, mantendo constante aperfeiçoamento em estilos como Hip-Hop, House Dance, Popping, Litefeet e K-Hip Hop.",
      "No MADS Project Musical, conduz as aulas de K-pop e Danças Urbanas, proporcionando aos alunos um ambiente dinâmico e acolhedor para desenvolver técnica, musicalidade, coordenação, criatividade e expressão corporal. Suas aulas incentivam a disciplina, o trabalho em equipe, a confiança e a descoberta da identidade artística de cada estudante.",
      "Verônica acredita que a dança é uma poderosa ferramenta de desenvolvimento humano, capaz de fortalecer a autoestima, ampliar a criatividade e transformar a forma como cada aluno se relaciona consigo mesmo e com o mundo.",
    ],
  },
  {
    name: "Cali Cortellini",
    role: "Teatro",
    image: withBasePath("/assets/professores/cali-cortellini.jpeg"),
    imagePosition: "center 30%",
    specialties: ["Teatro", "Dramaturgia", "Produção cultural"],
    bio: [
      "Cali Cortellini é atriz, professora de teatro e produtora cultural, licenciada em Artes Cênicas pela UNESP. Sua trajetória une experiência artística e pedagógica, desenvolvendo um trabalho voltado à formação sensível, criativa e acolhedora de crianças e jovens.",
      "Atuou como educadora em instituições como Sesc, CEUs, Maple Bear e Associação Vida Jovem, além de integrar o Programa de Iniciação Artística (PIÁ). Também desenvolve projetos autorais como atriz, dramaturga e produtora de espetáculos infantis, levando o teatro para diversos espaços culturais da cidade de São Paulo.",
      "Desde julho de 2026, integra a equipe da Mads Musical Project como professora de teatro, contribuindo para a formação artística de crianças e adolescentes por meio do teatro musical.",
      "Em suas aulas, busca estimular a criatividade, a expressão, a imaginação e o trabalho em equipe, proporcionando um ambiente acolhedor onde cada aluno pode desenvolver sua confiança, comunicação e potencial artístico.",
    ],
  },
  {
    name: "Luísa Grillo",
    role: "Canto",
    image: withBasePath("/assets/professores/luisa-grillo.jpeg"),
    imagePosition: "center 24%",
    specialties: ["Canto", "Musicalização", "Interpretação"],
    bio: [
      "Atriz de teatro musical, cantora e arte-educadora, Luísa Grillo atua na formação artística de crianças, adolescentes e adultos, unindo técnica, sensibilidade e uma abordagem acolhedora. É bacharel em Artes Cênicas pelo Centro Universitário Belas Artes e Técnica em Teatro Musical pela São Paulo Escola de Dança.",
      "Com experiência em escolas de música e teatro musical, desenvolve o trabalho vocal, a musicalização e a interpretação, respeitando a individualidade e o processo de aprendizagem de cada aluno. Também possui formação em educação inclusiva e musicalização infantil, ampliando sua atuação com diferentes perfis de estudantes.",
      "Além da docência, integra o elenco de espetáculos premiados e atua na direção de cena e movimento em projetos de teatro musical, trazendo para a sala de aula uma vivência prática e atual do universo artístico.",
    ],
  },
  {
    name: "Pedro Guida",
    role: "Canto",
    image: withBasePath("/assets/professores/pedro-guida.jpeg"),
    imagePosition: "center 35%",
    specialties: ["Voz", "Teatro musical", "Sonoplastia"],
    bio: [
      "Ator e cantor, Bacharel em Arte, Crítica e Curadoria pela PUC-SP, Pedro tem 14 anos de experiência unindo sua paixão pela música e teatro.",
      "Com formação em canto e teatro musical, estudou com nomes como Maestro Marconi Araújo e Tine Grote, além de aprimorar-se na USP, INDAC, 4Act e Escola Thymeli.",
      "Nos palcos, protagonizou e integrou espetáculos como \"Hércules, o Musical\", \"Rent\" e \"Mahabharata\". Como preparador vocal e sonoplasta na A Peste CIA Urbana de Teatro, cria trilhas sonoras inéditas.",
    ],
  },
];

export const guestTeacherProfiles = [
  {
    name: "Miguel Gonçalves",
    role: "Teatro e circo",
    image: withBasePath("/assets/professores/miguel-goncalves.jpeg"),
    imagePosition: "center 22%",
    specialties: ["Teatro", "Circo", "Educação infantil"],
    bio: [
      "Arte-educador e ator formado em Artes Cênicas pela Universidade Estadual Paulista, com experiência em teatro, circo e educação infantil.",
      "Atualmente atua como professor de teatro nas escolas Maple Bear e ARBOS. Também trabalhou como educador infantil no espaço Quintal da Vila, utilizando abordagens inspiradas em Montessori e Emmi Pickler.",
      "Sua trajetória inclui atuação como professor de circo, palhaço voluntário na Operação Arco-Íris, orientador teatral pela POIESIS e participação em coletivos e espetáculos teatrais premiados.",
    ],
  },
  {
    name: "Mariana Rodrigues",
    role: "Figurino",
    image: withBasePath("/assets/professores/mariana-rodrigues.jpeg"),
    imagePosition: "center 28%",
    specialties: ["Figurino", "Design de moda", "Narrativa visual"],
    bio: [
      "Mariana Rodrigues é formada em Design de Moda e atua como figurinista, desenvolvendo projetos que unem criatividade, pesquisa e narrativa visual. Sua experiência na área da educação inclui a atuação como professora de Figurino, ministrando aulas voltadas à introdução e ao aprofundamento dos processos de criação de trajes para as artes cênicas.",
      "Em sua prática pedagógica, aborda temas como pesquisa de referências, construção da identidade visual de personagens, contexto histórico, teoria das cores, tecidos e processos criativos aplicados ao figurino. Seu trabalho busca estimular a criatividade, o olhar crítico e a compreensão do figurino como elemento essencial para a construção da narrativa e da linguagem cênica.",
      "No Mads Musical Project, Mariana é responsável pelas aulas especiais de Figurino do curso regular, proporcionando aos alunos experiências práticas que ampliam o repertório artístico e incentivam a expressão individual por meio da criação de personagens e da construção visual para o teatro musical.",
    ],
  },
];

export const ageRanges = [
  "4 a 6 anos",
  "7 a 10 anos",
  "11 a 14 anos",
  "15 a 17 anos",
  "Adulto",
];

export const interestCourses = [
  "Teatro Musical",
  "Street Dance",
  "K-pop",
];

export const marqueeItems = [
  "Canto",
  "Teatro",
  "Dança",
  "Figurino",
  "Cenografia",
  "Maquiagem",
];

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/mads-logo.jpeg`,
  email: site.email,
  telephone: site.whatsappDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Tonelero, 938 - Vila Ipojuca",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "05056-001",
    addressCountry: "BR",
  },
  sameAs: [site.instagram],
};

export const portalStorageLimitBytes = 1024 * 1024 * 1024;
export const portalUploadLimitBytes = 10 * 1024 * 1024;

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export const portalSetupSteps = [
  "Crie um projeto gratuito no Supabase.",
  "Execute a migração SQL em supabase/migrations.",
  "Crie um usuário admin e marque o perfil como admin.",
  "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  "Publique a Edge Function invite-user para convites seguros.",
];

export const initialSchoolCopy = [
  "O Mads Project é uma escola de teatro musical focada no desenvolvimento artístico e humano de crianças e adolescentes. Aqui, a arte desperta talentos, fortalece a autoestima e forma pessoas mais criativas, confiantes e preparadas para os desafios da vida.",
  "Com uma formação completa em canto, dança e interpretação, nossos alunos vivem experiências que estimulam expressão, disciplina, trabalho em equipe e comunicação em um ambiente acolhedor e inspirador.",
  "Cada etapa da jornada é celebrada em um espetáculo profissional, onde o aprendizado ganha vida diante do público e cada aluno tem a oportunidade de brilhar no palco.",
];

export const orientadoraQuote =
  "Mads Project foi criado com a missão de transformar o ensino de teatro musical. A ideia surgiu após uma experiência frustrante em uma escola que desvalorizava o trabalho dos professores e a pedagogia aplicada com os alunos. Isso me motivou a criar um curso totalmente diferente, baseado no respeito, na autonomia e na formação de cidadãos pensantes.";

export const freeTierNotes = [
  "1 GB de arquivos no Supabase Storage no plano gratuito.",
  "Limite local de 10 MB por upload para proteger o orçamento.",
  "Sem vídeo no portal v1; use links externos se necessário.",
  "Projetos gratuitos podem pausar por baixa atividade.",
];

export const adminDefaultMessage =
  "O portal está pronto para Supabase Free. Configure as variáveis de ambiente para ativar login, convites e arquivos protegidos.";
